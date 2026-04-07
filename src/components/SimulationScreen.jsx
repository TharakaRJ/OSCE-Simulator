import { useState, useRef, useEffect } from "react";
import { styles } from "../styles/appStyles";
import { HistoryPanel } from "./HistoryPanel";
import { ExamPanel } from "./ExamPanel";
import { ProcedureDrawer } from "./ProcedureDrawer";
import { getClinicalStatus } from "../utils/patientUtils";
import auscultationImage from "../../nano_banana_images/auscultation.jpeg";
import baselineDistressedImage from "../../nano_banana_images/baseline_distressed.jpeg";
import collapsedImage from "../../nano_banana_images/collapsed.jpeg";
import historyTakingImage from "../../nano_banana_images/history_taking.jpeg";
import ivOnlyImage from "../../nano_banana_images/iv_only.jpeg";
import ivOxygenOnlyImage from "../../nano_banana_images/iv_oxygen_only.jpeg";
import monitoringIvImage from "../../nano_banana_images/monitoring_iv.jpeg";
import monitoringIvOxygenImage from "../../nano_banana_images/monitoring_iv_oxygen.jpeg";
import monitoringOnlyImage from "../../nano_banana_images/monitoring_only.jpeg";
import monitoringOxygenImage from "../../nano_banana_images/monitoring_oxygen.jpeg";
import oxygenOnlyImage from "../../nano_banana_images/oxygen.jpeg";
import preExaminationImage from "../../nano_banana_images/pre_examination.jpeg";
import semiRecumbentImage from "../../nano_banana_images/semi_recumbent.jpeg";
import stabilizedImage from "../../nano_banana_images/stabilized.jpeg";

// ── Narration detection ─────────────────────────────────────────────────────
const NARRATION_SUFFIXES = [
  " The patient sounds tired and answers more briefly now.",
  " The patient is struggling to stay focused.",
];

const PURE_NARRATION = new Set([
  "The patient is becoming groggy and disoriented and can no longer give a useful history.",
  "The patient is too groggy and disoriented to give any more useful history.",
  "Patient has collapsed and cannot respond."
]);

function splitHistoryResponse(response) {
  if (PURE_NARRATION.has(response)) {
    return { spoken: null, narration: response };
  }
  for (const suffix of NARRATION_SUFFIXES) {
    if (response.endsWith(suffix)) {
      return {
        spoken: response.slice(0, response.length - suffix.length).trim(),
        narration: suffix.trim(),
      };
    }
  }
  return { spoken: response, narration: null };
}

function getPatientImage({
  hasMonitoring,
  hasIV,
  hasOxygen,
  isStabilized,
  isCollapsed,
  isTakingHistory,
  isExamining,
  isAuscultating,
  showPositioningTransition
}) {
  if (isCollapsed) {
    return collapsedImage;
  }

  if (showPositioningTransition) {
    return semiRecumbentImage;
  }

  if (isStabilized) {
    return stabilizedImage;
  }

  if (isAuscultating) {
    return auscultationImage;
  }

  if (isExamining) {
    return preExaminationImage;
  }

  if (isTakingHistory) {
    return historyTakingImage;
  }

  if (hasOxygen) {
    if (hasMonitoring && hasIV) return monitoringIvOxygenImage;
    if (hasMonitoring) return monitoringOxygenImage;
    if (hasIV) return ivOxygenOnlyImage;
    return oxygenOnlyImage;
  }

  if (hasMonitoring && hasIV) {
    return monitoringIvImage;
  }

  if (hasMonitoring) {
    return monitoringOnlyImage;
  }

  if (hasIV) {
    return ivOnlyImage;
  }

  return baselineDistressedImage;
}

// ── ABCDE data ──────────────────────────────────────────────────────────────
const ABCDE_ITEMS = [
  {
    letter: "A",
    label: "Airway",
    items: [
      { id: "airway_assess", label: "Assess airway", actionType: "airway" }
    ]
  },
  {
    letter: "B",
    label: "Breathing",
    items: [
      { id: "resp_inspect", label: "Inspect breathing", actionType: "exam" },
      { id: "resp_ausc", label: "Auscultate lungs", actionType: "exam" }
    ]
  },
  {
    letter: "C",
    label: "Circulation",
    items: [
      { id: "cv_pulse", label: "Check pulse", actionType: "exam" },
      { id: "cv_bp", label: "Check blood pressure", actionType: "exam" },
      { id: "per_caprefill", label: "Check capillary refill", actionType: "exam" }
    ]
  },
  {
    letter: "D",
    label: "Disability",
    items: [
      { id: "gen_responsive", label: "Check responsiveness", actionType: "exam" }
    ]
  },
  {
    letter: "E",
    label: "Exposure",
    items: [
      { id: "gen_overall", label: "General inspection", actionType: "exam" },
      { id: "gen_distress", label: "Assess distress", actionType: "exam" },
      { id: "gen_sweating", label: "Assess sweating", actionType: "exam" }
    ]
  }
];

// ── ABCDEPanel (inlined) ────────────────────────────────────────────────────
function ABCDEPanel({ actions, score, onAddUpdate, onClose, onPerformExam }) {
  const renderSection = (section) => (
    <div key={section.letter} style={styles.abcdeSection}>
      <div style={styles.abcdeLetter}>
        <span style={styles.abcdeLetterBig}>{section.letter}</span>
        <span style={styles.abcdeLetterLabel}>{section.label}</span>
      </div>
      <div style={styles.abcdeActions}>
        {section.items.map((item) => (
          <button
            key={item.id}
            style={{ ...styles.button, ...styles.compactButton, ...styles.listButton }}
            onClick={() => {
              if (item.actionType === "airway") {
                actions.assessAirway();
              } else if (item.id === "cv_bp" && !score.monitoringRequested) {
                onAddUpdate("ABCDE: Monitoring required for accurate blood pressure measurement.");
              } else {
                onPerformExam({ id: item.id, label: item.label }, "ABCDE");
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  const col1 = ABCDE_ITEMS.slice(0, 3); // A, B, C
  const col2 = ABCDE_ITEMS.slice(3, 5); // D, E

  return (
    <div style={styles.abcdeShell}>
      <div style={styles.drawerHeader}>
        <strong>ABCDE Assessment</strong>
        <button style={styles.smallButton} onClick={onClose}>Close</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px",
          alignItems: "start",
          justifyContent: "start",
          width: "100%",
          maxWidth: "100%"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {col1.map(renderSection)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {col2.map(renderSection)}
        </div>
      </div>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────────────────
export function SimulationScreen({
  patient,
  score,
  meta,
  log,
  historyState,
  examState,
  actions,
  onEndStation
}) {
  const [activePanel, setActivePanel] = useState(null);
  const [investigationsOpen, setInvestigationsOpen] = useState(false);
  const [examImageMode, setExamImageMode] = useState(null);
  const [showPositioningTransition, setShowPositioningTransition] = useState(false);

  const [communication, setCommunication] = useState([]);
  const [clinicalUpdates, setClinicalUpdates] = useState([]);

  const commFeedRef = useRef(null);
  const updatesFeedRef = useRef(null);
  const prevLogLengthRef = useRef(0);
  const positioningTimerRef = useRef(null);

  function addCommunication(speaker, line) {
    setCommunication((prev) => [...prev, { speaker, line }]);
  }

  function addUpdate(text) {
    setClinicalUpdates((prev) => [...prev, text]);
  }

  useEffect(() => {
    if (commFeedRef.current) {
      commFeedRef.current.scrollTop = commFeedRef.current.scrollHeight;
    }
  }, [communication]);

  useEffect(() => {
    if (updatesFeedRef.current) {
      updatesFeedRef.current.scrollTop = updatesFeedRef.current.scrollHeight;
    }
  }, [clinicalUpdates]);

  useEffect(() => () => {
    if (positioningTimerRef.current) {
      clearTimeout(positioningTimerRef.current);
    }
  }, []);

  // Watch log for new system events
  useEffect(() => {
    const newEntries = log.slice(prevLogLengthRef.current);
    prevLogLengthRef.current = log.length;
    const filtered = newEntries.filter(
      (e) => !e.startsWith("History: ") && e !== "You introduced yourself."
    );
    if (filtered.length > 0) {
      setClinicalUpdates((prev) => [...prev, ...filtered]);
    }
  }, [log]);

  function togglePanel(panelName) {
    clearPositioningTransition();
    setExamImageMode(null);
    setActivePanel((prev) => (prev === panelName ? null : panelName));
  }

  function clearPositioningTransition() {
    if (positioningTimerRef.current) {
      clearTimeout(positioningTimerRef.current);
      positioningTimerRef.current = null;
    }

    setShowPositioningTransition(false);
  }

  function handlePerformExam(item, source = "Exam") {
    clearPositioningTransition();
    const isAuscultationAction = item.id === "resp_ausc" || item.id === "cv_heart";
    setExamImageMode(isAuscultationAction ? "auscultation" : "exam");
    actions.performExam(item, source);
  }

  function handlePositionPatient() {
    clearPositioningTransition();
    setShowPositioningTransition(true);
    positioningTimerRef.current = setTimeout(() => {
      setShowPositioningTransition(false);
      positioningTimerRef.current = null;
    }, 1000);

    actions.positionPatient();
  }

  function handleIntroduce() {
    actions.introduce();
    if (!score.introduced) {
      addCommunication("Doctor", "Hello, I'm one of the doctors.");
      addCommunication("Patient", "Doctor… my chest… it hurts… I feel awful…");
    }
  }

  function handleReassure() {
    const result = actions.reassurePatient();
    if (result && !result.success) {
      if (result.reason === "collapsed") {
        addUpdate("The patient has collapsed and cannot respond to reassurance.");
      } else if (result.reason === "groggy") {
        addUpdate("The patient is too disoriented to engage with reassurance.");
      }
    } else if (result && result.success) {
      addCommunication("Doctor", "You're safe. We're taking care of you. Try to stay calm.");
      addUpdate("Patient reassured. Anxiety reduced.");
    }
  }

  function handleAskQuestion(question) {
    const response = actions.askHistoryQuestion(question);
    if (!response) {
      return;
    }

    addCommunication("Doctor", question.text);
    const { spoken, narration } = splitHistoryResponse(response);
    if (spoken) addCommunication("Patient", spoken);
    if (narration) addUpdate(narration);
  }

  const speakerColors = {
    Doctor: "#7ecfff",
    Patient: "#ff9a6c",
    Nurse: "#a8e6cf",
    Technician: "#c3b1e1",
  };

  const clinicalStatus = getClinicalStatus({ patient, score, meta });
  const isCollapsed = clinicalStatus === "collapsed";
  const isStabilized = clinicalStatus === "stabilized";
  const isTakingHistory = activePanel === "history";
  const isExamining = activePanel === "exam" || activePanel === "abcde";
  const isAuscultating = isExamining && examImageMode === "auscultation";
  const patientImage = getPatientImage({
    hasMonitoring: score.monitoringRequested,
    hasIV: score.ivRequested,
    hasOxygen: score.oxygenGiven,
    isStabilized,
    isCollapsed,
    isTakingHistory,
    isExamining,
    isAuscultating,
    showPositioningTransition
  });

  const procedureActions = {
    ...actions,
    requestMonitoring: () => {
      clearPositioningTransition();
      actions.requestMonitoring();
    },
    requestIVAccess: () => {
      clearPositioningTransition();
      actions.requestIVAccess();
    },
    giveAspirin: () => {
      clearPositioningTransition();
      actions.giveAspirin();
    },
    giveAnalgesia: () => {
      clearPositioningTransition();
      actions.giveAnalgesia();
    },
    giveOxygen: () => {
      clearPositioningTransition();
      actions.giveOxygen();
    },
    giveNitroglycerin: () => {
      clearPositioningTransition();
      actions.giveNitroglycerin();
    },
    requestECG: () => {
      clearPositioningTransition();
      actions.requestECG();
    },
    requestBloods: () => {
      clearPositioningTransition();
      actions.requestBloods();
    },
    callForHelp: () => {
      clearPositioningTransition();
      actions.callForHelp();
    },
    positionPatient: handlePositionPatient
  };

  return (
    <div style={{ ...styles.page, display: "flex", flexDirection: "column", height: "100vh", minHeight: "100vh", overflow: "hidden" }}>
      {/* ── Top bar ── */}
      <div style={styles.simTopBar}>
        <span style={styles.simAppTitle}>Simman Simulator</span>
        <div style={styles.primaryActionBar}>
          <button style={styles.button} onClick={handleIntroduce}>
            Introduce Yourself
          </button>
          <button style={styles.button} onClick={() => togglePanel("history")}>
            Take History
          </button>
          <button style={styles.button} onClick={() => togglePanel("abcde")}>
            ABCDE Assessment
          </button>
          <button style={styles.button} onClick={() => togglePanel("exam")}>
            Systematic Examination
          </button>
          <button style={styles.button} onClick={() => togglePanel("procedure")}>
            Perform Procedure
          </button>
          <button style={styles.button} onClick={handleReassure}>
            Reassure Patient
          </button>
        </div>
        <button style={{ ...styles.button, ...styles.endStationButton }} onClick={() => onEndStation({ communication, clinicalUpdates })}>
          End Station
        </button>
      </div>

      {/* ── Main simulation grid ── */}
      <div style={{ ...styles.simulationLayout, flex: 1, minHeight: 0 }}>

        {/* ── Left / main column ── */}
        <div style={styles.mainColumn}>
          <div style={styles.patientStateCard}>
            <div style={styles.patientStateCardHeader}>
              <span style={styles.patientStateCardIcon}>❤</span>
              <span style={styles.patientStateCardTitle}>Patient State</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: "13px", marginTop: "8px" }}>
              <span style={{ color: "#7ecfff", textAlign: "right" }}>Airway:</span>
              <span style={{ whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>{patient.airway}</span>

              <span style={{ color: "#7ecfff", textAlign: "right" }}>Breathing:</span>
              <span style={{ whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>{patient.breathing}</span>

              {score.monitoringRequested ? (
                <>
                  <span style={{ color: "#7ecfff", textAlign: "right" }}>BP:</span>
                  <span style={{ whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>{patient.bp} mmHg</span>

                  <span style={{ color: "#7ecfff", textAlign: "right" }}>SpO₂:</span>
                  <span style={{ whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>{patient.spo2}%</span>
                </>
              ) : (
                <div style={{ gridColumn: "1 / -1", marginTop: "4px" }}>
                  <button
                    style={{ ...styles.smallButton, width: "100%" }}
                    onClick={() => actions.requestMonitoring()}
                  >
                    Request Monitoring
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginTop: "10px", fontSize: "12px", paddingTop: "6px", borderTop: "1px solid #233148", whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>
              {(() => {
                if (clinicalStatus === "collapsed") {
                  return <div style={{ color: "#ff8a80" }}>The patient has collapsed and cannot respond.</div>;
                }
                if (clinicalStatus === "stabilized") {
                  return <div style={{ color: "#a8e6cf" }}>The patient remains unwell but is more comfortable after initial treatment.</div>;
                }
                if (clinicalStatus === "groggy") {
                  return <div style={{ color: "#ff9a6c" }}>The patient is now groggy and disoriented from prolonged questioning.</div>;
                }
                if (clinicalStatus === "fatigued") {
                  return <div style={{ color: "#a0aec0" }}>The patient is becoming tired and less able to give a useful history.</div>;
                }
                if (clinicalStatus === "distressed") {
                  return <div style={{ color: "#ff9a6c" }}>The patient appears distressed and in pain.</div>;
                }
                return null;
              })()}
            </div>
          </div>

          {/* Active panels */}
          {activePanel === "abcde" && (
            <ABCDEPanel
              actions={actions}
              score={score}
              onAddUpdate={addUpdate}
              onPerformExam={handlePerformExam}
              onClose={() => {
                setExamImageMode(null);
                setActivePanel(null);
              }}
            />
          )}

          {activePanel === "history" && (
            <HistoryPanel
              historyState={historyState}
              onSelectCategory={actions.selectHistoryCategory}
              onAskQuestion={handleAskQuestion}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === "exam" && (
            <ExamPanel
              examState={examState}
              onSelectCategory={actions.selectExamCategory}
              onPerformExam={handlePerformExam}
              onClose={() => {
                setExamImageMode(null);
                setActivePanel(null);
              }}
            />
          )}

          {activePanel === "procedure" && (
            <ProcedureDrawer actions={procedureActions} onClose={() => setActivePanel(null)} />
          )}
        </div>

        <div style={styles.patientVisualColumn}>
          <div style={styles.patientImageWrap}>
            <img
              src={patientImage}
              alt="Patient clinical state"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ── Right combined panel ── */}
        <div style={styles.rightPanel}>

          {/* TOP: Clinical Communication */}
          <div style={styles.commSection}>
            <strong style={styles.commTitle}>Clinical Communication</strong>
            <div style={styles.commFeed} ref={commFeedRef}>
              {communication.length === 0 ? (
                <div style={styles.commEmpty}>Awaiting interaction…</div>
              ) : (
                communication.map((entry, i) => (
                  <div key={i} style={styles.commEntry}>
                    <span style={{ ...styles.commSpeaker, color: speakerColors[entry.speaker] || "#e8ecf1" }}>
                      {entry.speaker}
                    </span>
                    <span style={styles.commLine}>{entry.line}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={styles.panelDivider} />

          {/* BOTTOM: Clinical Updates */}
          <div style={styles.updatesSection}>
            <strong style={styles.updatesTitle}>Clinical Updates</strong>
            <div style={styles.updatesFeed} ref={updatesFeedRef}>
              {clinicalUpdates.length === 0 ? (
                <div style={styles.commEmpty}>No clinical events recorded yet.</div>
              ) : (
                clinicalUpdates.map((item, i) => (
                  <div key={i} style={styles.commLine}>{item}</div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── Investigations tab — anchored, opens left into viewport ── */}
        <div style={styles.investigationsTabWrap}>
          <button
            style={styles.investigationsTabIcon}
            onClick={() => setInvestigationsOpen((prev) => !prev)}
            title={investigationsOpen ? "Close Investigations" : "Open Investigations"}
          >
            <span style={styles.investigationsTabLabel}>
              <span style={{ fontSize: 15 }}>{investigationsOpen ? "✕" : "📋"}</span>
              <span style={styles.investigationsTabText}>Investigations</span>
            </span>
          </button>

          {investigationsOpen && (
            <div style={styles.investigationsPanel}>
              <div style={styles.drawerHeader}>
                <strong>Investigations</strong>
                <button style={styles.smallButton} onClick={() => setInvestigationsOpen(false)}>
                  Close
                </button>
              </div>
              <div style={styles.section}>
                <strong>ECG</strong>
                <div style={{ ...styles.wrappedText, marginTop: 6 }}>{meta.ecgResult || "Not yet requested."}</div>
              </div>
              <div style={{ ...styles.section, marginTop: 10 }}>
                <strong>Blood Tests</strong>
                <div style={{ ...styles.wrappedText, marginTop: 6 }}>{meta.bloodResult || "Not yet requested."}</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
