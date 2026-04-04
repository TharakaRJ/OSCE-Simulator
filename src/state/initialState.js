export function getInitialPatient() {
  return {
    airway: "unknown",
    breathing: "labored",
    bp: 120,
    spo2: null
  };
}

export function getInitialScore() {
  return {
    introduced: false,
    distressRecognized: false,
    airwayChecked: false,
    breathingChecked: false,
    circulationChecked: false,
    generalChecked: false,
    monitoringRequested: false,
    ivRequested: false,
    oxygenGiven: false,
    nitroGiven: 0,
    analgesiaGiven: false,
    aspirinGiven: false,
    ecgRequested: false,
    bloodsRequested: false,
    helpCalled: false,
    positionedPatient: false,
    reassuredPatient: false
  };
}

export function getInitialHistoryState() {
  return {
    selectedCategory: "presentingComplaint",
    questionCounts: {}
  };
}

export function getInitialExamState() {
  return {
    selectedCategory: "general",
    performed: []
  };
}

export function getInitialMeta() {
  return {
    deteriorationSteps: 0,
    historyFatigue: 0,
    historyLocked: false,
    lowPriorityHistoryCount: 0,
    ecgResult: "ECG not requested yet.",
    bloodResult: "Blood tests not requested yet.",
    oxygenDecisionRecorded: false,
    oxygenIndicatedAtAdministration: null
  };
}
