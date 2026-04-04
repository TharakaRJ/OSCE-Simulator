import { styles } from "../styles/appStyles";

export function CueScreen({ onEnterRoom }) {
  return (
    <div style={styles.page}>
      <div style={styles.centeredScreen}>
        <h2 style={{ ...styles.title, marginBottom: 0, fontSize: 22 }}>Station Cue Card</h2>
        <div style={styles.cueCard}>
          <div style={styles.cueRow}><span style={styles.cueLabel}>Name</span><span>Mr Smith</span></div>
          <div style={styles.cueRow}><span style={styles.cueLabel}>Age</span><span>58 years old</span></div>
          <div style={styles.cueRow}><span style={styles.cueLabel}>Setting</span><span>Emergency Department</span></div>
          <div style={styles.cueRow}><span style={styles.cueLabel}>Complaint</span><span>Chest pain, appears distressed</span></div>
          <div style={styles.cueRow}><span style={styles.cueLabel}>Task</span><span>Assess and manage this patient as the attending doctor</span></div>
        </div>
        <button style={{ ...styles.button, padding: "10px 32px", fontSize: 13, fontWeight: "bold" }} onClick={onEnterRoom}>
          Enter Room
        </button>
      </div>
    </div>
  );
}
