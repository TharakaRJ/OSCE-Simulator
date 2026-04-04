import { styles } from "../styles/appStyles";

export function MenuScreen({ onStart }) {
  return (
    <div style={styles.page}>
      <div style={styles.menuHero}>
        <h1 style={styles.menuTitle}>Simman Simulator</h1>
        <p style={styles.menuSubtitle}>Clinical simulation for OSCE preparation</p>
        <button style={styles.menuButton} onClick={onStart}>
          Start Simulation
        </button>
      </div>
    </div>
  );
}
