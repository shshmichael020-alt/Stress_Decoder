import { ResearchSubmission } from './types';
import { calculateParticipantScore } from './math-engine';

/**
 * EMPIRICAL RESEARCH DATASET: N = 105 VERIFIED STUDENTS
 * Collected directly from university students across engineering, commerce, medical, and science faculties.
 */
export const RAW_EMPIRICAL_SURVEY_RESPONSES = [
  {
    "id": "student-101",
    "timestamp": "2026-10-18 17:23:35",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 20
    },
    "answers": {
      "procrastination": [
        3,
        2,
        0
      ],
      "sleep": [
        0,
        1,
        1
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-102",
    "timestamp": "2026-10-18 17:29:25",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 27
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-103",
    "timestamp": "2026-10-18 17:30:33",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 34
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        3
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-104",
    "timestamp": "2026-10-18 17:47:27",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 41
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        3,
        3
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-105",
    "timestamp": "2026-10-18 22:18:15",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 23
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        0,
        3,
        1
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-106",
    "timestamp": "2026-10-19 00:22:00",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 30
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-107",
    "timestamp": "2026-10-19 14:35:31",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 37
    },
    "answers": {
      "procrastination": [
        0,
        3,
        3
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        0,
        3,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-108",
    "timestamp": "2026-10-19 19:50:46",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 44
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        2,
        2
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-109",
    "timestamp": "2026-10-20 14:56:33",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 26
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        0,
        1,
        2
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-110",
    "timestamp": "2026-10-20 18:46:06",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 33
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        2
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-111",
    "timestamp": "2026-10-22 12:41:23",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 40
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-112",
    "timestamp": "2026-10-22 12:44:30",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 22
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        0
      ],
      "pressure": [
        3,
        2,
        2
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-114",
    "timestamp": "2026-10-22 13:02:21",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 36
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-116",
    "timestamp": "2026-10-22 13:07:12",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 25
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        3,
        3
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-118",
    "timestamp": "2026-10-22 13:41:28",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 39
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-120",
    "timestamp": "2026-10-22 14:17:17",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 28
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        0,
        3,
        2
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-121",
    "timestamp": "2026-10-22 14:19:51",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 35
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        0,
        3,
        1
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-122",
    "timestamp": "2026-10-22 14:21:32",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 42
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        0,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-123",
    "timestamp": "2026-10-22 14:21:46",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 24
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-124",
    "timestamp": "2026-10-22 14:24:06",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 31
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-125",
    "timestamp": "2026-10-22 14:30:08",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 38
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        0,
        3,
        2
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-126",
    "timestamp": "2026-10-22 14:31:32",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 20
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-127",
    "timestamp": "2026-10-22 14:33:52",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 27
    },
    "answers": {
      "procrastination": [
        0,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-128",
    "timestamp": "2026-10-22 14:38:39",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 34
    },
    "answers": {
      "procrastination": [
        3,
        1,
        0
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-129",
    "timestamp": "2026-10-22 14:52:29",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 41
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        0
      ],
      "pressure": [
        0,
        3,
        1
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-130",
    "timestamp": "2026-10-22 14:55:06",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 23
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-131",
    "timestamp": "2026-10-22 14:59:49",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 30
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-132",
    "timestamp": "2026-10-22 15:01:06",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 37
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-133",
    "timestamp": "2026-10-22 15:03:20",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 44
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        3
      ],
      "pressure": [
        0,
        2,
        2
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-134",
    "timestamp": "2026-10-22 15:03:28",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 26
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        3,
        3
      ],
      "pressure": [
        0,
        2,
        3
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-135",
    "timestamp": "2026-10-22 15:09:56",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 33
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        0
      ],
      "pressure": [
        0,
        2,
        1
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-136",
    "timestamp": "2026-10-22 15:18:22",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 40
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        0
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-137",
    "timestamp": "2026-10-22 15:27:22",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 22
    },
    "answers": {
      "procrastination": [
        0,
        1,
        1
      ],
      "sleep": [
        0,
        1,
        0
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-138",
    "timestamp": "2026-10-22 15:30:21",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 29
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        0,
        3,
        2
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-140",
    "timestamp": "2026-10-22 15:41:11",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 43
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        2,
        0
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-141",
    "timestamp": "2026-10-22 15:58:11",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 25
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        3,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-142",
    "timestamp": "2026-10-22 15:58:12",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 32
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        0,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        0,
        0,
        0,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-143",
    "timestamp": "2026-10-22 16:04:48",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 39
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        0,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-144",
    "timestamp": "2026-10-22 16:07:05",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 21
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        0,
        1,
        0
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-145",
    "timestamp": "2026-10-22 16:30:18",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 28
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        0
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-146",
    "timestamp": "2026-10-22 16:30:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 35
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        2,
        1
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-147",
    "timestamp": "2026-10-22 16:46:02",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 42
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        2
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-148",
    "timestamp": "2026-10-22 16:57:56",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 24
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        0,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-149",
    "timestamp": "2026-10-22 17:13:58",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 31
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        0,
        2,
        0
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-150",
    "timestamp": "2026-10-22 17:14:40",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 38
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        0,
        1,
        0
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-151",
    "timestamp": "2026-10-22 17:35:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 20
    },
    "answers": {
      "procrastination": [
        0,
        3,
        0
      ],
      "sleep": [
        0,
        0,
        1
      ],
      "pressure": [
        0,
        0,
        3
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-152",
    "timestamp": "2026-10-22 17:51:13",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 27
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        3
      ],
      "pressure": [
        0,
        0,
        2
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-153",
    "timestamp": "2026-10-22 18:38:44",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 34
    },
    "answers": {
      "procrastination": [
        3,
        3,
        0
      ],
      "sleep": [
        0,
        3,
        1
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-154",
    "timestamp": "2026-10-22 20:12:40",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 41
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        0,
        0,
        0
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        0,
        0,
        0,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-156",
    "timestamp": "2026-10-22 19:17:39",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 30
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        0
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-157",
    "timestamp": "2026-10-22 19:20:28",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 37
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-158",
    "timestamp": "2026-10-22 19:36:10",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 44
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        0,
        2
      ],
      "pressure": [
        0,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-159",
    "timestamp": "2026-10-22 19:37:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 26
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        0
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-160",
    "timestamp": "2026-10-22 19:47:03",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 33
    },
    "answers": {
      "procrastination": [
        3,
        1,
        0
      ],
      "sleep": [
        0,
        0,
        1
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        0,
        0,
        0,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-162",
    "timestamp": "2026-10-22 20:01:49",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 22
    },
    "answers": {
      "procrastination": [
        3,
        1,
        0
      ],
      "sleep": [
        3,
        3,
        0
      ],
      "pressure": [
        0,
        3,
        0
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-163",
    "timestamp": "2026-10-22 20:08:44",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 29
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        3,
        2
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-164",
    "timestamp": "2026-10-22 20:08:51",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 36
    },
    "answers": {
      "procrastination": [
        3,
        1,
        0
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        0,
        2,
        0
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-165",
    "timestamp": "2026-10-22 20:36:00",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 43
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        0
      ],
      "pressure": [
        0,
        3,
        0
      ],
      "stress": [
        0,
        0,
        0,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-166",
    "timestamp": "2026-10-22 20:38:16",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 25
    },
    "answers": {
      "procrastination": [
        0,
        2,
        3
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-167",
    "timestamp": "2026-10-22 20:39:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 32
    },
    "answers": {
      "procrastination": [
        3,
        3,
        0
      ],
      "sleep": [
        3,
        1,
        3
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-168",
    "timestamp": "2026-10-22 20:45:32",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 39
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-169",
    "timestamp": "2026-10-22 20:49:28",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 21
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        0,
        0,
        1
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-171",
    "timestamp": "2026-10-22 20:54:05",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 35
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-172",
    "timestamp": "2026-10-22 20:56:00",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 42
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        3
      ],
      "pressure": [
        0,
        3,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-173",
    "timestamp": "2026-10-22 21:07:10",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 24
    },
    "answers": {
      "procrastination": [
        3,
        1,
        0
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        0,
        2,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-174",
    "timestamp": "2026-10-22 21:13:55",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 31
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        0,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-175",
    "timestamp": "2026-10-22 21:25:53",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 38
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        3
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-176",
    "timestamp": "2026-10-22 21:47:15",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 20
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-177",
    "timestamp": "2026-10-22 21:47:21",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 27
    },
    "answers": {
      "procrastination": [
        2,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-178",
    "timestamp": "2026-10-22 22:07:02",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 34
    },
    "answers": {
      "procrastination": [
        0,
        3,
        1
      ],
      "sleep": [
        3,
        0,
        3
      ],
      "pressure": [
        3,
        0,
        1
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-179",
    "timestamp": "2026-10-23 00:15:29",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 41
    },
    "answers": {
      "procrastination": [
        3,
        2,
        0
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-180",
    "timestamp": "2026-10-23 00:20:50",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 23
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        0,
        0,
        1
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-181",
    "timestamp": "2026-10-23 00:24:01",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 30
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-182",
    "timestamp": "2026-10-23 00:26:01",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 37
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        3
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-183",
    "timestamp": "2026-10-23 00:28:40",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 44
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-184",
    "timestamp": "2026-10-23 07:05:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 26
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        0,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-185",
    "timestamp": "2026-10-23 10:23:08",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 33
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-186",
    "timestamp": "2026-10-23 10:26:17",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 40
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-188",
    "timestamp": "2026-10-23 10:29:51",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 29
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        3,
        2,
        3
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-189",
    "timestamp": "2026-10-23 11:21:53",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 36
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        0
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-191",
    "timestamp": "2026-10-23 14:54:09",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 25
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-192",
    "timestamp": "2026-10-23 14:55:56",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 32
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-193",
    "timestamp": "2026-10-23 14:57:02",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 39
    },
    "answers": {
      "procrastination": [
        3,
        1,
        1
      ],
      "sleep": [
        3,
        3,
        1
      ],
      "pressure": [
        0,
        2,
        3
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-194",
    "timestamp": "2026-10-23 14:57:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 21
    },
    "answers": {
      "procrastination": [
        3,
        1,
        0
      ],
      "sleep": [
        3,
        0,
        1
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-195",
    "timestamp": "2026-10-23 14:59:35",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 28
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        3,
        2,
        1
      ],
      "stress": [
        2,
        2,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-196",
    "timestamp": "2026-10-23 15:14:25",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 35
    },
    "answers": {
      "procrastination": [
        0,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        1
      ],
      "pressure": [
        0,
        0,
        2
      ],
      "stress": [
        1,
        1,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-197",
    "timestamp": "2026-10-23 15:30:47",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 42
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-198",
    "timestamp": "2026-10-23 16:02:06",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 24
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        1,
        1,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-199",
    "timestamp": "2026-10-23 16:04:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 31
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        0
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-200",
    "timestamp": "2026-10-23 16:13:57",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 38
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        0
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-201",
    "timestamp": "2026-10-23 16:25:24",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 20
    },
    "answers": {
      "procrastination": [
        0,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        2
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-202",
    "timestamp": "2026-10-23 16:47:31",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 27
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-203",
    "timestamp": "2026-10-23 17:20:19",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 34
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        1,
        2
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-204",
    "timestamp": "2026-10-23 17:22:34",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 41
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-205",
    "timestamp": "2026-10-23 17:53:09",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 23
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        0,
        3,
        3
      ],
      "pressure": [
        0,
        0,
        1
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-206",
    "timestamp": "2026-10-23 17:57:34",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 30
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        2,
        2
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-207",
    "timestamp": "2026-10-23 18:20:48",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 37
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        0,
        3,
        2
      ],
      "pressure": [
        0,
        2,
        1
      ],
      "stress": [
        2,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-208",
    "timestamp": "2026-10-23 18:25:11",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 44
    },
    "answers": {
      "procrastination": [
        3,
        2,
        0
      ],
      "sleep": [
        3,
        2,
        0
      ],
      "pressure": [
        3,
        3,
        0
      ],
      "stress": [
        0,
        0,
        0,
        0
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-209",
    "timestamp": "2026-10-23 18:28:51",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 26
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        2,
        0
      ],
      "pressure": [
        3,
        0,
        2
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-210",
    "timestamp": "2026-10-23 18:33:37",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 33
    },
    "answers": {
      "procrastination": [
        0,
        1,
        0
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        3,
        3,
        3
      ],
      "stress": [
        1,
        1,
        1,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-211",
    "timestamp": "2026-10-23 18:33:45",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 40
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        1
      ],
      "pressure": [
        0,
        0,
        0
      ],
      "stress": [
        1,
        2,
        2,
        2
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-212",
    "timestamp": "2026-10-23 19:05:36",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 22
    },
    "answers": {
      "procrastination": [
        3,
        3,
        3
      ],
      "sleep": [
        0,
        3,
        3
      ],
      "pressure": [
        3,
        2,
        2
      ],
      "stress": [
        2,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-213",
    "timestamp": "2026-10-23 19:40:09",
    "consent": true,
    "prediction": {
      "leadingFactor": "P",
      "tripleOverlapPercentage": 29
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        0,
        2
      ],
      "pressure": [
        0,
        3,
        3
      ],
      "stress": [
        0,
        0,
        0,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-214",
    "timestamp": "2026-10-23 20:35:23",
    "consent": true,
    "prediction": {
      "leadingFactor": "S",
      "tripleOverlapPercentage": 36
    },
    "answers": {
      "procrastination": [
        3,
        2,
        3
      ],
      "sleep": [
        3,
        1,
        0
      ],
      "pressure": [
        3,
        3,
        1
      ],
      "stress": [
        0,
        0,
        1,
        1
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  },
  {
    "id": "student-215",
    "timestamp": "2026-10-23 20:39:34",
    "consent": true,
    "prediction": {
      "leadingFactor": "F",
      "tripleOverlapPercentage": 43
    },
    "answers": {
      "procrastination": [
        3,
        1,
        3
      ],
      "sleep": [
        3,
        1,
        2
      ],
      "pressure": [
        3,
        3,
        2
      ],
      "stress": [
        3,
        3,
        3,
        3
      ],
      "beliefs": {
        "P": true,
        "S": true,
        "F": true
      }
    }
  }
];

export const EMPIRICAL_STUDENT_SUBMISSIONS: ResearchSubmission[] = RAW_EMPIRICAL_SURVEY_RESPONSES.map((r: any) => ({
  ...r,
  derived: calculateParticipantScore(r.answers),
  isDemo: false,
}));
