import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateParticipantScore,
  calculateVennCounts,
  calculateTruthTable,
  calculateAssociation,
  calculateBeliefComparison,
  aggregateResearchSubmissions,
  computeSimulatorVenn,
} from '../lib/math-engine';
import { QuestionnaireAnswers, ResearchSubmission } from '../lib/types';
import { validateSubmissionPayload } from '../lib/storage';

describe('Exam Stress Triangle — Math Engine & Invariant Verification', () => {
  // Test 1: Minimum and Maximum Stress Scores
  it('should correctly score minimum and maximum stress responses', () => {
    const minAnswers: QuestionnaireAnswers = {
      procrastination: [0, 0, 0],
      sleep: [0, 0, 0],
      pressure: [0, 0, 0],
      stress: [0, 0, 0, 0],
      beliefs: { P: false, S: false, F: false },
    };
    const minResult = calculateParticipantScore(minAnswers);
    assert.equal(minResult.scoreStress, 0);
    assert.equal(minResult.stressPercentage, 0);
    assert.equal(minResult.stressCategory, 'lower');
    assert.equal(minResult.isE, false);

    const maxAnswers: QuestionnaireAnswers = {
      procrastination: [3, 3, 3],
      sleep: [3, 3, 3],
      pressure: [3, 3, 3],
      stress: [3, 3, 3, 3],
      beliefs: { P: true, S: true, F: true },
    };
    const maxResult = calculateParticipantScore(maxAnswers);
    assert.equal(maxResult.scoreStress, 12);
    assert.equal(maxResult.stressPercentage, 100);
    assert.equal(maxResult.stressCategory, 'higher');
    assert.equal(maxResult.isE, true);
  });

  // Test 2: Factor membership at totals of 5 and 6
  it('should enforce factor membership strictly at score >= 6 out of 9', () => {
    // Score = 5 (Borderline Below)
    const belowAnswers: QuestionnaireAnswers = {
      procrastination: [2, 2, 1], // 5
      sleep: [1, 2, 2], // 5
      pressure: [2, 2, 1], // 5
      stress: [1, 1, 1, 0], // 3 -> isE = false
      beliefs: { P: true, S: true, F: true },
    };
    const belowScore = calculateParticipantScore(belowAnswers);
    assert.equal(belowScore.scoreP, 5);
    assert.equal(belowScore.isP, false, 'Score 5 should NOT meet factor rule');
    assert.equal(belowScore.isS, false);
    assert.equal(belowScore.isF, false);
    assert.equal(belowScore.isE, false);

    // Score = 6 (Threshold Met)
    const metAnswers: QuestionnaireAnswers = {
      procrastination: [2, 2, 2], // 6
      sleep: [3, 2, 1], // 6
      pressure: [3, 3, 0], // 6
      stress: [1, 1, 1, 1], // 4 -> isE = true
      beliefs: { P: true, S: true, F: true },
    };
    const metScore = calculateParticipantScore(metAnswers);
    assert.equal(metScore.scoreP, 6);
    assert.equal(metScore.isP, true, 'Score 6 MUST meet factor rule');
    assert.equal(metScore.isS, true);
    assert.equal(metScore.isF, true);
    assert.equal(metScore.isE, true, 'Stress score 4 must meet Set E');
  });

  // Test 3: All 8 Venn Regions & Sum Invariant
  it('should accurately compute all eight mutually exclusive Venn regions summing to N', () => {
    // Synthetic dataset covering all 8 combinations
    const mock = [
      { isP: true, isS: false, isF: false }, // 1: pOnly
      { isP: true, isS: false, isF: false },
      { isP: false, isS: true, isF: false }, // 2: sOnly
      { isP: false, isS: false, isF: true }, // 3: fOnly
      { isP: true, isS: true, isF: false },  // 4: psOnly
      { isP: true, isS: false, isF: true },  // 5: pfOnly
      { isP: false, isS: true, isF: true },  // 6: sfOnly
      { isP: true, isS: true, isF: true },   // 7: psf
      { isP: false, isS: false, isF: false },// 8: none
      { isP: false, isS: false, isF: false },// 8: none
    ]; // total N = 10

    const venn = calculateVennCounts(mock);
    assert.equal(venn.total, 10);
    assert.equal(venn.pOnly, 2);
    assert.equal(venn.sOnly, 1);
    assert.equal(venn.fOnly, 1);
    assert.equal(venn.psOnly, 1);
    assert.equal(venn.pfOnly, 1);
    assert.equal(venn.sfOnly, 1);
    assert.equal(venn.psf, 1);
    assert.equal(venn.none, 2);

    // Invariant: sum of all 8 regions must equal N
    const regionSum =
      venn.pOnly +
      venn.sOnly +
      venn.fOnly +
      venn.psOnly +
      venn.pfOnly +
      venn.sfOnly +
      venn.psf +
      venn.none;
    assert.equal(regionSum, 10);
  });

  // Test 4: Inclusion-Exclusion Identity against Direct Union Counting
  it('should verify that PIE union equals direct counting of union', () => {
    const mock = [
      { isP: true, isS: true, isF: false },
      { isP: false, isS: true, isF: true },
      { isP: true, isS: false, isF: true },
      { isP: true, isS: true, isF: true },
      { isP: false, isS: false, isF: false },
      { isP: false, isS: false, isF: false },
    ];
    const venn = calculateVennCounts(mock);

    // PIE: |P| + |S| + |F| - |P∩S| - |P∩F| - |S∩F| + |P∩S∩F|
    const pieCount =
      venn.sizeP +
      venn.sizeS +
      venn.sizeF -
      venn.interPS -
      venn.interPF -
      venn.interSF +
      venn.psf;

    assert.equal(venn.unionPSF, pieCount);
    assert.equal(venn.unionPSF, 4); // 4 students had at least one factor
    assert.equal(venn.none, 2);
  });

  // Test 5: Truth Table Logical Values for All Assignments
  it('should correctly evaluate classical material implication truth values (T->F is False)', () => {
    const testSet = [
      { factor: true, isE: true },   // T -> T : True
      { factor: true, isE: false },  // T -> F : False (Counterexample!)
      { factor: false, isE: true },  // F -> T : True (Vacuous)
      { factor: false, isE: false }, // F -> F : True (Vacuous)
    ];

    const table = calculateTruthTable(testSet, 'P');
    assert.equal(table.rows[0].logicValue, true);
    assert.equal(table.rows[1].logicValue, false, 'T -> F must be False');
    assert.equal(table.rows[2].logicValue, true);
    assert.equal(table.rows[3].logicValue, true);
    assert.equal(table.falseCount, 1);
  });

  // Test 6: Observed Truth Table Counts with Empty Rows
  it('should handle zero-count rows in truth tables safely', () => {
    // Only students who are T -> T
    const testSet = [
      { factor: true, isE: true },
      { factor: true, isE: true },
    ];
    const table = calculateTruthTable(testSet, 'S');
    assert.equal(table.rows[0].count, 2);
    assert.equal(table.rows[1].count, 0);
    assert.equal(table.rows[2].count, 0);
    assert.equal(table.rows[3].count, 0);
    assert.equal(table.falseCount, 0);
  });

  // Test 7: Association Calculations with Empty Groups
  it('should handle empty denominators safely in association calculations', () => {
    // All students have factor = true, factor = false is empty
    const testSet = [
      { factor: true, isE: true },
      { factor: true, isE: false },
    ];
    const assoc = calculateAssociation(testSet, 'F');
    assert.equal(assoc.factorPresentCount, 2);
    assert.equal(assoc.factorPresentRate, 50);
    assert.equal(assoc.factorAbsentCount, 0);
    assert.equal(assoc.factorAbsentRate, 0); // No division by zero crash
    assert.equal(assoc.percentagePointDiff, 50);
  });

  // Test 8: What-If Simulator Validation & Error Detection
  it('should flag impossible set configurations in the simulator', () => {
    // Impossible case: |P ∩ S ∩ F| exceeds pairwise |P ∩ S|
    const invalidInputs: SimulatorInputs = {
      totalN: 100,
      sizeP: 50,
      sizeS: 50,
      sizeF: 50,
      interPS: 10,
      interPF: 20,
      interSF: 20,
      psf: 30, // 30 > 10 (Impossible!)
    };
    const result = computeSimulatorVenn(invalidInputs);
    assert.equal(result.isValid, false);
    assert.ok(result.errors.length > 0);

    // Valid case
    const validInputs: SimulatorInputs = {
      totalN: 100,
      sizeP: 50,
      sizeS: 40,
      sizeF: 30,
      interPS: 20,
      interPF: 15,
      interSF: 10,
      psf: 5,
    };
    const validResult = computeSimulatorVenn(validInputs);
    assert.equal(validResult.isValid, true);
    assert.ok(validResult.venn);
    assert.ok(validResult.venn.none >= 0);
  });

  // Test 9: Submission Payload Validation
  it('should validate anonymous research submission payloads strictly', () => {
    const validPayload = {
      consent: true,
      prediction: { leadingFactor: 'P' as const, tripleOverlapPercentage: 35 },
      answers: {
        procrastination: [1, 2, 3] as [any, any, any],
        sleep: [0, 1, 2] as [any, any, any],
        pressure: [2, 2, 2] as [any, any, any],
        stress: [1, 2, 1, 1] as [any, any, any, any],
        beliefs: { P: true, S: true, F: false },
      },
    };
    assert.equal(validateSubmissionPayload(validPayload).valid, true);

    // Missing consent
    assert.equal(
      validateSubmissionPayload({ ...validPayload, consent: false }).valid,
      false
    );

    // Out of range value
    const outOfRange = JSON.parse(JSON.stringify(validPayload));
    outOfRange.answers.procrastination[0] = 5; // Invalid (0-3 allowed)
    assert.equal(validateSubmissionPayload(outOfRange).valid, false);
  });
});
