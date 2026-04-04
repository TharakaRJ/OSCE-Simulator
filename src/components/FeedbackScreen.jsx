import { styles } from "../styles/appStyles";

export function FeedbackScreen({ feedback, criticalErrors, communication = [], clinicalUpdates = [], onReturnToMenu }) {
  return (
    <div style={{ ...styles.page, padding: "24px", maxWidth: "1200px", margin: "0 auto", alignItems: "stretch" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h2 style={{ margin: 0, color: "#fff" }}>Performance Feedback</h2>
          <div style={{ fontSize: "16px", color: "#a8e6cf", marginTop: "4px" }}>Outcome: <strong style={{color: "#fff"}}>{feedback.outcome}</strong></div>
        </div>
        <button style={{ ...styles.button, width: "auto" }} onClick={onReturnToMenu}>
          Return to Menu
        </button>
      </div>

      {/* Main Grid: 3 columns or 2 columns based layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Domain Scores */}
          <div style={{ ...styles.section, textAlign: "left" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Domain Scores</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {feedback.domainScores.map((domain) => (
                <div key={domain.label}>
                  <div style={{ fontWeight: "bold", fontSize: "15px", color: "#7ecfff" }}>
                    {domain.label} — {domain.score} / {domain.total}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
                    {domain.criteria && domain.criteria.map((crit) => (
                      <div key={crit.label} style={{ fontSize: "13px", color: crit.met ? "#a8e6cf" : "#ff9a6c" }}>
                        {crit.met ? "✓" : "✗"} {crit.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div style={{ ...styles.section, textAlign: "left" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Strengths</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" }}>
              {feedback.strengths?.length === 0 ? (
                <div style={{ color: "#d9e2ec" }}>None identified.</div>
              ) : (
                feedback.strengths?.map((item) => <div key={item} style={{ color: "#a8e6cf" }}>✓ {item}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Checklist */}
          <div style={{ ...styles.section, textAlign: "left" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Clinical Checklist</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
              {feedback.checklist.map((item) => (
                <div key={item.label} style={{ color: item.met ? "#a8e6cf" : "#ff9a6c" }}>
                  {item.met ? "✓" : "✗"} {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Critical Errors & Missed Actions */}
          <div style={{ ...styles.section, textAlign: "left" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#ff9a6c", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Safety & Missed Actions</h3>
            
            <div style={{ marginBottom: "12px" }}>
              <strong style={{ color: "#fff", fontSize: "14px" }}>Critical Errors</strong>
              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
                {criticalErrors.length === 0 ? (
                  <div style={{ color: "#a8e6cf" }}>✓ None recorded</div>
                ) : (
                  criticalErrors.map((item) => <div key={item} style={{ color: "#ff9a6c" }}>✗ {item}</div>)
                )}
              </div>
            </div>

            <div>
              <strong style={{ color: "#fff", fontSize: "14px" }}>Key Missed Actions</strong>
              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
                {feedback.missedActions?.length === 0 ? (
                  <div style={{ color: "#a8e6cf" }}>✓ None identified</div>
                ) : (
                  feedback.missedActions?.map((item) => <div key={item} style={{ color: "#ff9a6c" }}>✗ {item}</div>)
                )}
              </div>
            </div>
          </div>

          {/* Points for Improvement */}
          <div style={{ ...styles.section, textAlign: "left" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Points for Improvement</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" }}>
              {feedback.teachingPoints.length === 0 ? (
                <div style={{ color: "#d9e2ec" }}>No major additional teaching points.</div>
              ) : (
                feedback.teachingPoints.map((item) => <div key={item} style={{ paddingLeft: "10px", textIndent: "-10px" }}>• {item}</div>)
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Replay Row (Side-by-side) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        {/* Communication Replay */}
        <div style={{ ...styles.section, textAlign: "left" }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#fff", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Communication Replay</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto", paddingRight: "8px" }}>
            {communication.length === 0 ? (
              <div style={{ color: "#d9e2ec" }}>No communication recorded.</div>
            ) : (
              communication.map((entry, i) => (
                <div key={i} style={{ padding: "6px", borderLeft: `2px solid ${entry.speaker === 'Doctor' ? '#7ecfff' : '#ff9a6c'}`, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                  <span style={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", color: "#d9e2ec" }}>{entry.speaker}</span>
                  <div style={{ fontSize: "13px", marginTop: "4px" }}>{entry.line}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Updates Replay */}
        <div style={{ ...styles.section, textAlign: "left" }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#fff", borderBottom: "1px solid #334e68", paddingBottom: "8px" }}>Clinical Updates Replay</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "250px", overflowY: "auto", paddingRight: "8px" }}>
            {clinicalUpdates.length === 0 ? (
              <div style={{ color: "#d9e2ec" }}>No clinical events recorded.</div>
            ) : (
              clinicalUpdates.map((item, i) => (
                <div key={i} style={{ fontSize: "13px", paddingLeft: "12px", textIndent: "-12px" }}>• {item}</div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
