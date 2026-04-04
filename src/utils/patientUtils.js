export function updateBreathingFromBP(bp) {
  if (bp <= 70) return "very shallow";
  if (bp <= 85) return "shallow";
  if (bp <= 95) return "labored";
  return "improving";
}

export function updateSpo2FromBP(bp, currentSpo2) {
  if (currentSpo2 === null) return null;
  if (bp <= 70) return Math.max(85, currentSpo2 - 3);
  if (bp <= 85) return Math.max(88, currentSpo2 - 2);
  if (bp <= 95) return Math.max(90, currentSpo2 - 1);
  return currentSpo2;
}

export function isLowPriorityHistoryQuestion(questionId) {
  return [
    "as_cough",
    "as_fever",
    "as_leg_swelling",
    "as_palpitations",
    "hpc_previous"
  ].includes(questionId);
}

export function getClinicalStatus({ patient, score, meta }) {
  if (patient.bp !== null && patient.bp <= 70) return "collapsed";

  if (
    score.monitoringRequested &&
    score.ivRequested &&
    score.aspirinGiven &&
    score.analgesiaGiven &&
    score.positionedPatient
  ) return "stabilized";

  if (meta.historyLocked) return "groggy";

  if (meta.historyFatigue >= 3) return "fatigued";

  return "distressed";
}

export function isPostStabilisationState(score) {
  return (
    score.monitoringRequested &&
    score.ivRequested &&
    score.aspirinGiven &&
    score.analgesiaGiven &&
    score.positionedPatient
  );
}

export function getStationPhase(score, patient) {
  const stabilisingStarted =
    score.monitoringRequested ||
    score.ivRequested ||
    score.oxygenGiven ||
    score.analgesiaGiven ||
    score.aspirinGiven ||
    score.helpCalled ||
    score.positionedPatient;

  const reassessmentUnlocked = isPostStabilisationState(score);

  if (patient.bp <= 70) {
    return "urgent";
  }

  if (reassessmentUnlocked) {
    return "postStabilisation";
  }

  if (stabilisingStarted) {
    return "stabilisation";
  }

  return "focusedHistory";
}

export function getHistoryResponse({ questionId, askCount, meta, patient, score }) {
  if (patient.bp <= 70) {
    return "Patient has collapsed and cannot respond.";
  }

  if (meta.historyLocked) {
    return "The patient is too groggy and disoriented to give any more useful history.";
  }

  const improvedPain = score.analgesiaGiven || (score.nitroGiven > 0 && patient.bp > 70);

  const responses = {
    pc_brought_in: [
      "I've got this heavy chest pain, doctor.",
      "It’s this heavy chest pain.",
      "I already told you, it’s chest pain.",
      "Chest pain."
    ],
    pc_when_start: [
      "It started about 30 minutes ago.",
      "About 30 minutes ago.",
      "About half an hour ago.",
      "Half an hour ago."
    ],
    hpc_site: [
      "Right in the center of my chest.",
      "In the middle of my chest.",
      "I told you, it’s in the center of my chest.",
      "My chest."
    ],
    hpc_character: [
      "It feels like a heavy pressure, like something is sitting on my chest.",
      "It feels like a heavy pressure.",
      "Heavy pressure.",
      "Pressure."
    ],
    hpc_radiation: [
      "Yes, it’s going down my left arm.",
      "Yes, into my left arm.",
      "I already said it goes to my left arm.",
      "Left arm."
    ],
    hpc_severity: [
      improvedPain ? "It’s a bit better now, maybe 5 out of 10." : "It’s about 8 out of 10.",
      improvedPain ? "About 5 out of 10 now." : "About 8 out of 10.",
      improvedPain ? "Still there, but better." : "Still very bad.",
      improvedPain ? "Better." : "Bad."
    ],
    hpc_onset_type: [
      "It came on quite suddenly.",
      "Suddenly.",
      "I already told you, it came on suddenly.",
      "Suddenly."
    ],
    hpc_timing: [
      "It’s been constant since it started.",
      "It’s been constant.",
      "I said it’s been constant.",
      "Constant."
    ],
    hpc_worse: [
      "Moving makes it worse.",
      "Moving makes it worse.",
      "It gets worse when I move.",
      "Moving."
    ],
    hpc_better: [
      improvedPain ? "The pain relief has helped a bit." : "Nothing really helps.",
      improvedPain ? "It’s a bit better after the pain relief." : "Nothing helps.",
      improvedPain ? "A bit better now." : "Still nothing helps.",
      improvedPain ? "A bit better." : "No."
    ],
    hpc_previous: [
      "No, I’ve never had this before.",
      "No, never before.",
      "No.",
      "No."
    ],
    as_sob: [
      patient.bp <= 95 ? "Yes, I feel more breathless now." : "Yes, I feel a bit breathless.",
      patient.bp <= 95 ? "Yes, more breathless." : "Yes, a bit breathless.",
      "Yes.",
      "Yes."
    ],
    as_sweating: ["Yes, I’m sweating a lot.", "Yes, quite a lot.", "Yes.", "Yes."],
    as_nausea: ["Yes, I feel a bit sick.", "Yes, I feel sick.", "Yes.", "Yes."],
    as_palpitations: ["No, not really.", "No.", "No.", "No."],
    as_dizziness: [
      patient.bp <= 95 ? "Yes, I feel lightheaded." : "I feel slightly lightheaded.",
      patient.bp <= 95 ? "Yes, a bit dizzy." : "A bit lightheaded.",
      "Yes.",
      "Yes."
    ],
    as_cough: ["No.", "No.", "No.", "No."],
    as_fever: ["No.", "No.", "No.", "No."],
    as_leg_swelling: ["No.", "No.", "No.", "No."]
  };

  const responseSet = responses[questionId] || [
    "I’m not sure.",
    "I’m not sure.",
    "I don’t know.",
    "No."
  ];

  let response = responseSet[3];
  if (askCount === 1) response = responseSet[0];
  if (askCount === 2) response = responseSet[1];
  if (askCount === 3) response = responseSet[2];

  if (meta.fatigueFrozen || isPostStabilisationState(score)) {
    return response;
  }

  const projectedFatigue = meta.historyFatigue + 1;
  const fatigueLimit = patient.bp <= 95 ? 5 : 6;

  if (projectedFatigue >= fatigueLimit) {
    return "The patient is becoming groggy and disoriented and can no longer give a useful history.";
  }

  if (projectedFatigue >= fatigueLimit - 1) {
    return `${response} The patient is struggling to stay focused.`;
  }

  if (projectedFatigue >= 3) {
    return `${response} The patient sounds tired and answers more briefly now.`;
  }

  return response;
}

export function getExamFinding({ id, patient, score }) {
  const bp = patient.bp;

  if (id === "cv_bp") {
    return `Blood pressure is ${patient.bp} mmHg.`;
  }

  const severeMap = {
    gen_overall: "The patient looks critically unwell.",
    gen_distress: "The patient appears severely unwell and in distress.",
    gen_sweating: "The patient is diaphoretic.",
    gen_responsive: "The patient is minimally responsive.",
    cv_pulse: "Pulse is very weak and thready.",
    cv_heart: "Heart sounds are present with no obvious new murmur.",
    cv_jvp: "JVP is not obviously elevated.",
    resp_inspect: "Breathing is very shallow.",
    resp_ausc: "Air entry is present bilaterally with no obvious focal crackles.",
    per_caprefill: "Capillary refill is significantly delayed.",
    per_pulses: "Peripheral pulses are very weak.",
    per_legs: "No obvious leg swelling is noted.",
    mon_review: score.monitoringRequested
      ? "Monitor shows the current blood pressure and oxygen saturation readings."
      : "No monitor readings are available because monitoring has not been requested."
  };

  const moderateMap = {
    gen_overall: "The patient looks unwell and distressed.",
    gen_distress: "The patient appears to be in pain.",
    gen_sweating: "The patient is diaphoretic.",
    gen_responsive: "The patient looks lightheaded but responsive.",
    cv_pulse: "Pulse is fast and weak.",
    cv_heart: "Heart sounds are present with no obvious new murmur.",
    cv_jvp: "JVP is not obviously elevated.",
    resp_inspect: "Breathing is labored and shallow.",
    resp_ausc: "Air entry is present bilaterally with no obvious focal crackles.",
    per_caprefill: "Capillary refill is slightly delayed.",
    per_pulses: "Peripheral pulses are weak.",
    per_legs: "No obvious leg swelling is noted.",
    mon_review: score.monitoringRequested
      ? "Monitor shows the current blood pressure and oxygen saturation readings."
      : "No monitor readings are available because monitoring has not been requested."
  };

  const normalMap = {
    gen_overall: "The patient looks unwell and distressed.",
    gen_distress: "The patient appears to be in pain.",
    gen_sweating: "The patient is diaphoretic.",
    gen_responsive: "The patient is alert and responsive.",
    cv_pulse: "Pulse is slightly fast but palpable.",
    cv_heart: "Heart sounds are present with no obvious new murmur.",
    cv_jvp: "JVP is not obviously elevated.",
    resp_inspect: "Breathing is slightly labored.",
    resp_ausc: "Air entry is present bilaterally with no obvious focal crackles.",
    per_caprefill: "Capillary refill is normal.",
    per_pulses: "Peripheral pulses are present.",
    per_legs: "No obvious leg swelling is noted.",
    mon_review: score.monitoringRequested
      ? "Monitor shows the current blood pressure and oxygen saturation readings."
      : "No monitor readings are available because monitoring has not been requested."
  };

  let finding = normalMap[id] || "No significant finding.";
  if (bp <= 70) {
    finding = severeMap[id] || "No significant finding.";
  } else if (bp <= 95) {
    finding = moderateMap[id] || "No significant finding.";
  }

  if (isPostStabilisationState(score)) {
    finding = finding.replace("The patient looks unwell and distressed.", "The patient remains unwell but is more comfortable.");
    finding = finding.replace("The patient appears to be in pain.", "The patient remains unwell but is less distressed.");
    finding = finding.replace("Breathing is labored and shallow.", "Breathing is improved and less labored.");
    finding = finding.replace("Breathing is slightly labored.", "Breathing is improved and less labored.");
  }

  return finding;
}
