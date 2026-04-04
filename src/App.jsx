import { useRef, useState } from "react";
import { MenuScreen } from "./components/MenuScreen";
import { CaseSelectionScreen } from "./components/CaseSelectionScreen";
import { CueScreen } from "./components/CueScreen";
import { SimulationScreen } from "./components/SimulationScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import {
  getInitialPatient,
  getInitialScore,
  getInitialHistoryState,
  getInitialExamState,
  getInitialMeta
} from "./state/initialState";
import {
  updateBreathingFromBP,
  updateSpo2FromBP,
  isLowPriorityHistoryQuestion,
  isPostStabilisationState,
  getStationPhase,
  getHistoryResponse,
  getExamFinding
} from "./utils/patientUtils";
import { calculateFeedback } from "./utils/feedback";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [log, setLog] = useState([]);
  const [patient, setPatient] = useState(getInitialPatient());
  const [score, setScore] = useState(getInitialScore());
  const [meta, setMeta] = useState(getInitialMeta());
  const [criticalErrors, setCriticalErrors] = useState([]);
  const [historyState, setHistoryState] = useState(getInitialHistoryState());
  const [examState, setExamState] = useState(getInitialExamState());
  const [replayData, setReplayData] = useState({ communication: [], clinicalUpdates: [] });
  const stabilizationLoggedRef = useRef(false);

  function addLog(text) {
    setLog((prev) => [...prev, text]);
  }

  function addCriticalError(text) {
    setCriticalErrors((prev) => {
      if (prev.includes(text)) return prev;
      return [...prev, text];
    });
  }

  function logStabilizationIfNeeded(nextScore) {
    if (stabilizationLoggedRef.current || !isPostStabilisationState(nextScore)) {
      return;
    }

    stabilizationLoggedRef.current = true;
    addLog("Patient condition stabilizing following initial management.");
  }

  function applySequenceProgression(actionType) {
    let deterioration = 0;
    const postStabilisation = isPostStabilisationState(score);

    if (!postStabilisation) {
      if (!score.monitoringRequested) {
        if (actionType === "introduce" || actionType === "airway") {
          deterioration += 1;
        } else if (actionType === "history") {
          deterioration += 2;
        } else if (actionType === "exam" || actionType === "reassure") {
          deterioration += 3;
        }
      }

      if (!score.helpCalled && (actionType === "exam" || actionType === "reassure")) {
        deterioration += 1;
      }

      if (actionType === "history" && patient.bp <= 95) {
        deterioration += 1;
      }
    }

    setMeta((prev) => ({
      ...prev,
      deteriorationSteps:
        deterioration > 0 ? prev.deteriorationSteps + 1 : prev.deteriorationSteps
    }));

    if (deterioration === 0 || postStabilisation) {
      return;
    }

    setPatient((prev) => {
      const newBP = Math.max(40, prev.bp - deterioration);
      return {
        ...prev,
        bp: newBP,
        breathing: newBP <= 95 ? updateBreathingFromBP(newBP) : prev.breathing,
        spo2: updateSpo2FromBP(newBP, prev.spo2)
      };
    });
  }

  function resetSimulation() {
    stabilizationLoggedRef.current = false;
    setPatient(getInitialPatient());
    setScore(getInitialScore());
    setCriticalErrors([]);
    setLog([]);
    setHistoryState(getInitialHistoryState());
    setExamState(getInitialExamState());
    setMeta(getInitialMeta());
    setReplayData({ communication: [], clinicalUpdates: [] });
  }

  function introduce() {
    applySequenceProgression("introduce");

    if (!score.introduced) {
      setScore((prev) => ({ ...prev, introduced: true }));

      if (!meta.distressRecognized) {
        setMeta((prev) => ({ ...prev, distressRecognized: true }));
      }
    }
    addLog("You introduced yourself.");
  }

  function assessAirway() {
    applySequenceProgression("airway");
    setPatient((p) => ({ ...p, airway: "clear" }));

    if (!score.airwayChecked) {
      setScore((prev) => ({ ...prev, airwayChecked: true }));
    }

    addLog("ABCDE: Airway clear.");
  }

  function requestMonitoring() {
    if (score.monitoringRequested) {
      addLog("Monitoring has already been requested.");
      return;
    }

    const nextScore = { ...score, monitoringRequested: true };
    setScore(nextScore);
    logStabilizationIfNeeded(nextScore);
    setPatient((p) => ({
      ...p,
      spo2: 92
    }));

    addLog(
      "Monitoring requested. The patient is now on continuous blood pressure, pulse oximetry, and cardiac monitoring."
    );
  }

  function requestIVAccess() {
    if (score.ivRequested) {
      addLog("IV access has already been requested.");
      return;
    }

    const nextScore = { ...score, ivRequested: true };
    setScore(nextScore);
    logStabilizationIfNeeded(nextScore);
    addLog("IV access requested.");
  }

  function giveOxygen() {
    if (!score.oxygenGiven) {
      setScore((prev) => ({ ...prev, oxygenGiven: true }));

      const indicated = (patient.spo2 !== null && patient.spo2 <= 94) || patient.bp <= 70;
      setMeta((prev) => ({
        ...prev,
        oxygenDecisionRecorded: true,
        oxygenIndicatedAtAdministration: indicated
      }));
    }

    if (patient.spo2 === null) {
      addLog(
        "Oxygen administered before monitoring. No oxygen saturation reading is available yet to judge the response."
      );
      return;
    }

    if (patient.bp <= 70) {
      setPatient((p) => ({
        ...p,
        spo2: Math.min(p.spo2, 88),
        breathing: "very shallow"
      }));

      addLog(
        "Oxygen administered. Minimal or no improvement observed because circulation is severely compromised."
      );
      return;
    }

    if (patient.bp <= 85) {
      setPatient((p) => ({
        ...p,
        spo2: Math.min(92, p.spo2 + 2),
        breathing: "shallow"
      }));

      addLog(
        "Oxygen administered. Mild improvement observed, but the patient remains severely hypotensive."
      );
      return;
    }

    if (patient.bp <= 95) {
      setPatient((p) => ({
        ...p,
        spo2: Math.min(96, p.spo2 + 3),
        breathing: "labored"
      }));

      addLog(
        "Oxygen administered. Partial improvement observed, but hypotension is still affecting the patient."
      );
      return;
    }

    if (patient.spo2 > 94 && isPostStabilisationState(score)) {
      addLog("Oxygen given unnecessarily. No significant improvement observed.");
      return;
    }

    setPatient((p) => ({
      ...p,
      spo2: Math.min(98, p.spo2 + 4),
      breathing: "improving"
    }));

    addLog("Oxygen administered. Oxygen saturation improving.");
  }

  function giveAnalgesia() {
    if (score.analgesiaGiven) {
      addLog("Additional analgesia given. Limited further benefit.");
      return;
    }

    const nextScore = { ...score, analgesiaGiven: true };
    setScore(nextScore);
    logStabilizationIfNeeded(nextScore);
    addLog("Analgesia administered. The patient reports reduced chest pain.");
  }

  function giveAspirin() {
    if (score.aspirinGiven) {
      addLog("Aspirin has already been given.");
      return;
    }

    const nextScore = { ...score, aspirinGiven: true };
    setScore(nextScore);
    logStabilizationIfNeeded(nextScore);
    addLog("Aspirin administered.");
  }

  function giveNitroglycerin() {
    const nextDose = score.nitroGiven + 1;

    if (patient.bp <= 40) {
      setScore((prev) => ({ ...prev, nitroGiven: prev.nitroGiven + 1 }));
      addLog(
        `Nitroglycerin dose ${nextDose}: BP is 40 mmHg. The patient has already collapsed. No further meaningful effect is demonstrated.`
      );
      return;
    }

    let dropMin = 0;
    let dropMax = 0;

    if (patient.bp < 90) {
      dropMin = 25;
      dropMax = 45;
      addCriticalError("Nitroglycerin was given despite hypotension.");
    } else if (nextDose === 1) {
      dropMin = 8;
      dropMax = 15;
    } else if (nextDose === 2) {
      dropMin = 6;
      dropMax = 12;
    } else if (nextDose === 3) {
      dropMin = 4;
      dropMax = 9;
    } else {
      dropMin = 3;
      dropMax = 8;
    }

    const drop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin;

    const prevBP = patient.bp;
    const newBP = Math.max(40, Math.round(prevBP - drop));
    const newBreathing = updateBreathingFromBP(newBP);
    const newSpo2 = updateSpo2FromBP(newBP, patient.spo2);

    setPatient((p) => ({
      ...p,
      bp: newBP,
      breathing: newBreathing,
      spo2: newSpo2
    }));

    setScore((prev) => ({ ...prev, nitroGiven: prev.nitroGiven + 1 }));

    if (prevBP > 70 && newBP <= 70) {
      addCriticalError("Nitroglycerin led to severe hypotension and collapse.");
      addLog(
        `Nitroglycerin dose ${nextDose}: BP fell to ${newBP} mmHg. The patient has collapsed following severe hypotension.`
      );
      return;
    }

    if (newBP <= 85) {
      addLog(
        `Nitroglycerin dose ${nextDose}: BP fell to ${newBP} mmHg. The patient is now severely hypotensive.`
      );
      return;
    }

    if (newBP <= 95) {
      addLog(
        `Nitroglycerin dose ${nextDose}: BP fell to ${newBP} mmHg. The patient is becoming hypotensive.`
      );
      return;
    }

    addLog(`Nitroglycerin dose ${nextDose}: BP is now ${newBP} mmHg.`);
  }

  function requestECG() {
    if (score.ecgRequested) {
      addLog("ECG has already been requested.");
      return;
    }

    setScore((prev) => ({ ...prev, ecgRequested: true }));
    setMeta((prev) => ({
      ...prev,
      ecgResult:
        patient.bp <= 90
          ? "ECG: ST elevation in anterior leads with dynamic ischemic change."
          : "ECG: ST elevation in anterior leads."
    }));
    addLog("12-lead ECG requested.");
  }

  function requestBloods() {
    if (score.bloodsRequested) {
      addLog("Blood tests have already been requested.");
      return;
    }

    setScore((prev) => ({ ...prev, bloodsRequested: true }));
    setMeta((prev) => ({
      ...prev,
      bloodResult:
        patient.bp <= 90
          ? "Bloods: troponin raised. Urgent cardiac bloods sent."
          : "Bloods: troponin pending/likely raised. Cardiac bloods sent."
    }));
    addLog("Blood tests requested, including troponin and basic cardiac bloods.");
  }

  function callForHelp() {
    if (score.helpCalled) {
      addLog("Senior help has already been called.");
      return;
    }

    setScore((prev) => ({ ...prev, helpCalled: true }));
    addLog("Senior help requested and the acute coronary syndrome pathway activated.");
  }

  function positionPatient() {
    if (score.positionedPatient) {
      addLog("The patient is already positioned upright.");
      return;
    }

    const nextScore = { ...score, positionedPatient: true };
    setScore(nextScore);
    logStabilizationIfNeeded(nextScore);

    if (patient.bp > 70) {
      setPatient((p) => ({ ...p, breathing: "improving" }));
    }

    addLog("The patient has been positioned upright.");
  }

  function reassurePatient() {
    applySequenceProgression("reassure");

    if (patient.bp <= 70) {
      return { success: false, reason: "collapsed" };
    }
    
    if (meta.historyLocked && !isPostStabilisationState(score)) {
      return { success: false, reason: "groggy" };
    }

    if (score.reassuredPatient) {
      return { success: false, reason: "already_reassured" };
    }

    setScore((prev) => ({ ...prev, reassuredPatient: true }));
    return { success: true };
  }

  function selectHistoryCategory(categoryKey) {
    setHistoryState((prev) => ({
      ...prev,
      selectedCategory: categoryKey
    }));
  }

  function askHistoryQuestion(question) {
    applySequenceProgression("history");

    const isStabilized = isPostStabilisationState(score);

    if (meta.historyLocked && !isStabilized) {
      const response = "The patient is too groggy and disoriented to answer further questions.";
      addLog(`History: ${question.text}`);
      return response;
    }

    const currentPhase = getStationPhase(score, patient);
    const lowPriorityPenalty =
      currentPhase === "focusedHistory" && isLowPriorityHistoryQuestion(question.id) ? 1 : 0;

    const currentCount = historyState.questionCounts[question.id] || 0;
    const nextCount = currentCount + 1;
    
    // If stabilized, do not increment history fatigue.
    const nextHistoryFatigue = isStabilized
      ? meta.historyFatigue
      : meta.historyFatigue + 1 + lowPriorityPenalty;
    const fatigueLimit = patient.bp <= 95 ? 5 : 6;
    
    // Do not lock if stabilized.
    const isLocked = isStabilized ? meta.historyLocked : meta.historyLocked || nextHistoryFatigue >= fatigueLimit;

    const response = getHistoryResponse({
      questionId: question.id,
      askCount: nextCount,
      meta: { ...meta, historyFatigue: nextHistoryFatigue, historyLocked: isLocked, fatigueFrozen: isStabilized },
      patient,
      score
    });

    setMeta((prev) => ({
      ...prev,
      historyFatigue: nextHistoryFatigue,
      historyLocked: isLocked,
      lowPriorityHistoryCount: isStabilized ? prev.lowPriorityHistoryCount : prev.lowPriorityHistoryCount + lowPriorityPenalty
    }));

    setHistoryState((prev) => ({
      ...prev,
      questionCounts: {
        ...prev.questionCounts,
        [question.id]: nextCount
      }
    }));

    addLog(`History: ${question.text}`);
    return response;
  }

  function selectExamCategory(categoryKey) {
    setExamState((prev) => ({
      ...prev,
      selectedCategory: categoryKey
    }));
  }

  function performExam(item, source = "Exam") {
    applySequenceProgression("exam");
    const finding = getExamFinding({ id: item.id, patient, score });

    setScore((prev) => ({
      ...prev,
      breathingChecked: prev.breathingChecked || item.id.startsWith("resp_"),
      circulationChecked: prev.circulationChecked || item.id.startsWith("cv_") || item.id.startsWith("per_"),
      generalChecked: prev.generalChecked || item.id.startsWith("gen_")
    }));

    setExamState((prev) => ({
      ...prev,
      performed: [...prev.performed, item.label]
    }));

    addLog(`${source}: ${finding}`);
  }

  const feedback = calculateFeedback({ patient, score, meta, criticalErrors, examState });

  const actions = {
    introduce,
    assessAirway,
    requestMonitoring,
    requestIVAccess,
    giveAspirin,
    giveAnalgesia,
    giveOxygen,
    giveNitroglycerin,
    requestECG,
    requestBloods,
    callForHelp,
    positionPatient,
    reassurePatient,
    selectHistoryCategory,
    askHistoryQuestion,
    selectExamCategory,
    performExam
  };

  if (screen === "menu") {
    return <MenuScreen onStart={() => setScreen("case")} />;
  }

  if (screen === "case") {
    return <CaseSelectionScreen onSelectCase={() => setScreen("cue")} />;
  }

  if (screen === "cue") {
    return <CueScreen onEnterRoom={() => setScreen("sim")} />;
  }

  if (screen === "sim") {
    return (
      <SimulationScreen
        patient={patient}
        score={score}
        meta={meta}
        log={log}
        historyState={historyState}
        examState={examState}
        actions={actions}
        onEndStation={(data) => {
          setReplayData(data);
          setScreen("feedback");
        }}
      />
    );
  }

  if (screen === "feedback") {
    return (
      <FeedbackScreen
        feedback={feedback}
        criticalErrors={criticalErrors}
        communication={replayData.communication}
        clinicalUpdates={replayData.clinicalUpdates}
        onReturnToMenu={() => {
          resetSimulation();
          setScreen("menu");
        }}
      />
    );
  }

  return null;
}
