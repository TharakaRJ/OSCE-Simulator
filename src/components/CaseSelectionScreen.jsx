import { styles } from "../styles/appStyles";

export function CaseSelectionScreen({ onSelectCase }) {
  return (
    <div style={styles.page}>
      <div style={styles.centeredScreen}>
        <h2 style={{ ...styles.title, marginBottom: 0, fontSize: 24 }}>Select Case</h2>
        <div style={styles.centeredPanel}>
          <button style={{ ...styles.button, padding: "12px 24px", fontSize: 14, fontWeight: "bold", width: "100%" }} onClick={onSelectCase}>
            Acute MI
          </button>
        </div>
      </div>
    </div>
  );
}
