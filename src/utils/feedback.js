const UNSAFE_NITRO_ERROR = "Nitroglycerin was prescribed unsafely.";
const NITRO_COLLAPSE_ERROR = "The patient collapsed following unsafe nitroglycerin prescribing.";
const FAILED_STABILIZATION_ERROR = "Failed to stabilize the patient.";
const FAILED_STABILIZATION_COLLAPSE_ERROR =
  "Failed to stabilize the patient and the patient collapsed.";

export function calculateFeedback({
  patient,
  score,
  meta,
  criticalErrors,
  examState,
  historyState
}) {
  const totalHistoryQuestions = Object.values(historyState?.questionCounts || {}).reduce(
    (sum, count) => sum + count,
    0
  );
  const urgentActionStarted =
    score.airwayChecked ||
    score.breathingChecked ||
    score.circulationChecked ||
    score.monitoringRequested ||
    score.ivRequested ||
    score.oxygenGiven ||
    score.analgesiaGiven ||
    score.aspirinGiven ||
    score.helpCalled ||
    score.positionedPatient;
  const prolongedHistoryBeforeUrgentAction =
    meta.historyLocked ||
    meta.historyFatigue >= 3 ||
    meta.lowPriorityHistoryCount > 0 ||
    totalHistoryQuestions >= 5;

  const distressRecognized = urgentActionStarted && !prolongedHistoryBeforeUrgentAction;

  const managementStarted =
    score.monitoringRequested ||
    score.ivRequested ||
    score.oxygenGiven ||
    score.analgesiaGiven ||
    score.aspirinGiven ||
    score.helpCalled ||
    score.positionedPatient;

  const rapidABCDE =
    score.airwayChecked &&
    (score.breathingChecked || score.circulationChecked) &&
    managementStarted;

  const stabilizationComplete =
    score.monitoringRequested &&
    score.ivRequested &&
    score.aspirinGiven &&
    score.analgesiaGiven &&
    score.helpCalled &&
    score.positionedPatient;

  const focusedExamComplete =
    score.generalChecked && (score.breathingChecked || score.circulationChecked);

  const hasNitroCriticalError = criticalErrors.some(
    (item) => item === UNSAFE_NITRO_ERROR || item === NITRO_COLLAPSE_ERROR
  );
  const safeNitro = !hasNitroCriticalError;

  const highHistoryFatigue = meta.historyFatigue >= 3;
  const significantDeterioration = meta.deteriorationSteps >= 3;
  const oxygenMisuse = score.oxygenGiven && patient.bp <= 70;
  const safetyCriticalErrors = criticalErrors;

  const checklist = [
    { label: "Introduced self", met: score.introduced },
    { label: "Assessed airway", met: score.airwayChecked },
    { label: "Requested monitoring", met: score.monitoringRequested },
    { label: "Requested IV access", met: score.ivRequested },
    { label: "Gave aspirin", met: score.aspirinGiven },
    { label: "Gave analgesia", met: score.analgesiaGiven },
    { label: "Called for senior help", met: score.helpCalled },
    { label: "Requested ECG", met: score.ecgRequested },
    { label: "Requested blood tests", met: score.bloodsRequested },
    { label: "Positioned patient appropriately", met: score.positionedPatient },
    { label: "Reassured patient", met: score.reassuredPatient }
  ];

  if (meta.oxygenDecisionRecorded) {
    if (meta.oxygenIndicatedAtAdministration === true) {
      checklist.push({
        label: "Gave oxygen when indicated",
        met: score.oxygenGiven
      });
    } else {
      checklist.push({
        label: "Avoided unnecessary oxygen",
        met: !score.oxygenGiven
      });
    }
  }

  if (score.nitroGiven > 0 || hasNitroCriticalError) {
    checklist.push({
      label: "Used nitroglycerin safely",
      met: safeNitro
    });
  }

  let metCount = 0;
  checklist.forEach((item) => {
    if (item.met) metCount += 1;
  });

  let outcome = "Optimal";
  if (safetyCriticalErrors.length > 0) {
    outcome = "Unsafe";
  } else if (metCount < Math.ceil(checklist.length * 0.7)) {
    outcome = "Suboptimal";
  }

  const teachingPoints = [];

  if (!score.monitoringRequested) {
    teachingPoints.push(
      "Monitoring was delayed or omitted, so deterioration could have been missed until later in the station."
    );
  }

  if (!score.helpCalled) {
    teachingPoints.push(
      "Senior help was not called early enough for an unstable acute coronary syndrome presentation."
    );
  }

  if (meta.historyLocked || highHistoryFatigue) {
    teachingPoints.push(
      "Excessive questioning before stabilization led to cognitive fatigue, reducing the reliability of the history."
    );
  }

  if (meta.lowPriorityHistoryCount > 0) {
    teachingPoints.push(
      "Some early questions drifted away from the highest-yield urgent history points before the patient had been stabilised."
    );
  }

  if (significantDeterioration) {
    teachingPoints.push(
      "Prolonged non-urgent actions before stabilization contributed to patient deterioration."
    );
  }

  if (oxygenMisuse) {
    teachingPoints.push(
      "Oxygen was given during severe circulatory collapse, when the immediate priority should have been hemodynamic stabilization."
    );
  } else if (meta.oxygenDecisionRecorded && meta.oxygenIndicatedAtAdministration === false && score.oxygenGiven) {
    teachingPoints.push(
      "Oxygen was given when it was not indicated at the time of administration."
    );
  }

  if (!safeNitro) {
    teachingPoints.push(
      "Nitroglycerin was used unsafely in hypotension and worsened hemodynamic instability."
    );
  }

  if (examState?.performed?.length > 8) {
    teachingPoints.push(
      "Excessive examination steps were performed; a more focused exam would be better."
    );
  }

  const strengths = [];
  if (distressRecognized) strengths.push("Recognized that the patient was acutely unwell.");
  if (rapidABCDE) strengths.push("Performed a rapid ABCDE assessment and began management promptly.");
  if (stabilizationComplete) strengths.push("Completed the full initial stabilization bundle.");
  if (score.ecgRequested && score.bloodsRequested) strengths.push("Requested appropriate early investigations.");
  if (score.nitroGiven > 0 && safeNitro) {
    strengths.push("Safe and effective use of nitroglycerin.");
  }

  const missedActions = [];
  if (!score.ecgRequested) missedActions.push("ECG was missed or severely delayed.");
  if (!score.reassuredPatient) missedActions.push("Patient reassurance was missed.");
  if (!score.monitoringRequested) missedActions.push("Monitoring request was missed.");
  if (
    !stabilizationComplete &&
    !criticalErrors.includes(FAILED_STABILIZATION_ERROR) &&
    !criticalErrors.includes(FAILED_STABILIZATION_COLLAPSE_ERROR)
  ) {
    missedActions.push("The full stabilization bundle was not completed.");
  }

  const domainScores = [
    {
      label: "Initial assessment",
      score: Number(distressRecognized) + Number(rapidABCDE),
      total: 2,
      criteria: [
        { label: "Recognized distress", met: distressRecognized },
        { label: "Performed rapid ABCDE", met: rapidABCDE }
      ]
    },
    {
      label: "Stabilization",
      score:
        Number(score.monitoringRequested) +
        Number(score.ivRequested) +
        Number(score.aspirinGiven) +
        Number(score.analgesiaGiven) +
        Number(score.helpCalled),
      total: 5,
      criteria: [
        { label: "Requested monitoring", met: score.monitoringRequested },
        { label: "Requested IV access", met: score.ivRequested },
        { label: "Gave aspirin", met: score.aspirinGiven },
        { label: "Gave analgesia", met: score.analgesiaGiven },
        { label: "Called for senior help", met: score.helpCalled },
        { label: "Positioned patient appropriately", met: score.positionedPatient },
        { label: "Completed full stabilization bundle", met: stabilizationComplete }
      ]
    },
    {
      label: "Investigations",
      score: Number(score.ecgRequested) + Number(score.bloodsRequested),
      total: 2,
      criteria: [
        { label: "Requested ECG early", met: score.ecgRequested },
        { label: "Requested blood tests", met: score.bloodsRequested }
      ]
    },
    {
      label: "Focused Exam",
      score: Number(focusedExamComplete),
      total: 1,
      criteria: [
        { label: "Performed relevant examination", met: focusedExamComplete }
      ]
    },
    {
      label: "Safety",
      score: safetyCriticalErrors.length === 0 ? 2 : 0,
      total: 2,
      criteria: [
        { label: "No critical errors from unsafe treatment or failed stabilization", met: safetyCriticalErrors.length === 0 }
      ]
    },
    {
      label: "Communication",
      score: Number(score.reassuredPatient),
      total: 1,
      criteria: [
        { label: "Reassured patient", met: score.reassuredPatient }
      ]
    }
  ];

  return {
    checklist,
    outcome,
    teachingPoints,
    strengths,
    missedActions,
    domainScores
  };
}
