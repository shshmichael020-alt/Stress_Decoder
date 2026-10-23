-- ============================================================================
-- EXAM STRESS TRIANGLE — PREDICTION VS REALITY LAB
-- SUPABASE POSTGRESQL SCHEMA & SECURITY POLICIES
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: anonymous_submissions
-- Stores strictly anonymous participant submissions without any PII (no names, emails, IPs)
CREATE TABLE IF NOT EXISTS public.anonymous_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    consent_given BOOLEAN NOT NULL DEFAULT true,
    
    -- Predictions (Recorded strictly BEFORE questionnaire)
    predicted_leading_factor VARCHAR(1) NOT NULL CHECK (predicted_leading_factor IN ('P', 'S', 'F')),
    predicted_triple_overlap_pct NUMERIC(5, 2) NOT NULL CHECK (predicted_triple_overlap_pct >= 0 AND predicted_triple_overlap_pct <= 100),
    
    -- Questionnaire Answers:
    -- Round 1: Procrastination (0 to 3 each, max 9)
    ans_p1 SMALLINT NOT NULL CHECK (ans_p1 >= 0 AND ans_p1 <= 3),
    ans_p2 SMALLINT NOT NULL CHECK (ans_p2 >= 0 AND ans_p2 <= 3),
    ans_p3 SMALLINT NOT NULL CHECK (ans_p3 >= 0 AND ans_p3 <= 3),
    
    -- Round 2: Sleep Spiral (0 to 3 each, max 9)
    ans_s1 SMALLINT NOT NULL CHECK (ans_s1 >= 0 AND ans_s1 <= 3),
    ans_s2 SMALLINT NOT NULL CHECK (ans_s2 >= 0 AND ans_s2 <= 3),
    ans_s3 SMALLINT NOT NULL CHECK (ans_s3 >= 0 AND ans_s3 <= 3),
    
    -- Round 3: Pressure Zone (0 to 3 each, max 9)
    ans_f1 SMALLINT NOT NULL CHECK (ans_f1 >= 0 AND ans_f1 <= 3),
    ans_f2 SMALLINT NOT NULL CHECK (ans_f2 >= 0 AND ans_f2 <= 3),
    ans_f3 SMALLINT NOT NULL CHECK (ans_f3 >= 0 AND ans_f3 <= 3),
    
    -- Round 4: Stress Meter (0 to 3 each, max 12)
    ans_e1 SMALLINT NOT NULL CHECK (ans_e1 >= 0 AND ans_e1 <= 3),
    ans_e2 SMALLINT NOT NULL CHECK (ans_e2 >= 0 AND ans_e2 <= 3),
    ans_e3 SMALLINT NOT NULL CHECK (ans_e3 >= 0 AND ans_e3 <= 3),
    ans_e4 SMALLINT NOT NULL CHECK (ans_e4 >= 0 AND ans_e4 <= 3),
    
    -- Yes/No Belief Questions
    belief_p BOOLEAN NOT NULL,
    belief_s BOOLEAN NOT NULL,
    belief_f BOOLEAN NOT NULL,
    
    -- Derived Educational Fields (Calculated via Single Source of Truth)
    score_p SMALLINT GENERATED ALWAYS AS (ans_p1 + ans_p2 + ans_p3) STORED,
    score_s SMALLINT GENERATED ALWAYS AS (ans_s1 + ans_s2 + ans_s3) STORED,
    score_f SMALLINT GENERATED ALWAYS AS (ans_f1 + ans_f2 + ans_f3) STORED,
    score_stress SMALLINT GENERATED ALWAYS AS (ans_e1 + ans_e2 + ans_e3 + ans_e4) STORED,
    
    -- Factor Membership: Score >= 6 out of 9
    is_p BOOLEAN GENERATED ALWAYS AS ((ans_p1 + ans_p2 + ans_p3) >= 6) STORED,
    is_s BOOLEAN GENERATED ALWAYS AS ((ans_s1 + ans_s2 + ans_s3) >= 6) STORED,
    is_f BOOLEAN GENERATED ALWAYS AS ((ans_f1 + ans_f2 + ans_f3) >= 6) STORED,
    -- Elevated Stress: Score >= 4 out of 12
    is_e BOOLEAN GENERATED ALWAYS AS ((ans_e1 + ans_e2 + ans_e3 + ans_e4) >= 4) STORED,
    
    -- Client submission fingerprint (hash of non-identifying browser entropy to mitigate burst spam)
    client_token VARCHAR(64)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.anonymous_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_factors ON public.anonymous_submissions(is_p, is_s, is_f, is_e);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.anonymous_submissions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public anonymous insertion (with valid consent and non-identifying answers)
CREATE POLICY "Allow public anonymous submissions"
    ON public.anonymous_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (consent_given = true);

-- Policy 2: Prevent public SELECT of individual participant rows to preserve anonymity.
-- Public clients should query aggregate research statistics only.
CREATE POLICY "Deny public direct reading of individual records"
    ON public.anonymous_submissions
    FOR SELECT
    TO anon
    USING (false);

-- Policy 3: Allow backend service role full access for aggregate analytics
CREATE POLICY "Service role full access"
    ON public.anonymous_submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- AGGREGATE STATS FUNCTION (SECURITY DEFINER)
-- Returns public statistical summaries without exposing individual row logs.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_research_aggregate_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT json_build_object(
        'total_submissions', count(*),
        'size_p', count(*) FILTER (WHERE is_p = true),
        'size_s', count(*) FILTER (WHERE is_s = true),
        'size_f', count(*) FILTER (WHERE is_f = true),
        'inter_ps', count(*) FILTER (WHERE is_p = true AND is_s = true),
        'inter_pf', count(*) FILTER (WHERE is_p = true AND is_f = true),
        'inter_sf', count(*) FILTER (WHERE is_s = true AND is_f = true),
        'inter_psf', count(*) FILTER (WHERE is_p = true AND is_s = true AND is_f = true),
        'elevated_stress_count', count(*) FILTER (WHERE is_e = true),
        'predicted_p_count', count(*) FILTER (WHERE predicted_leading_factor = 'P'),
        'predicted_s_count', count(*) FILTER (WHERE predicted_leading_factor = 'S'),
        'predicted_f_count', count(*) FILTER (WHERE predicted_leading_factor = 'F'),
        'avg_predicted_triple_overlap', COALESCE(ROUND(AVG(predicted_triple_overlap_pct), 1), 0)
    ) INTO result
    FROM public.anonymous_submissions;

    RETURN result;
END;
$$;

-- Grant execution to anon
GRANT EXECUTE ON FUNCTION public.get_research_aggregate_stats() TO anon, authenticated, service_role;
