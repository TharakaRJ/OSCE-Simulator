import { EXAM_TREE } from "../data/examTree";
import { styles } from "../styles/appStyles";

export function ExamPanel({ examState, onSelectCategory, onPerformExam, onClose }) {
  const selectedExamCategory = EXAM_TREE[examState.selectedCategory];

  return (
    <div style={styles.drawerShell}>
      <div style={styles.drawerHeader}>
        <strong>Systematic Examination</strong>
        <button style={styles.smallButton} onClick={onClose}>
          Close
        </button>
      </div>

      <div style={styles.compactTwoColumn}>
        <div style={styles.section}>
          <strong>Examination Areas</strong>
          <div style={styles.listColumn}>
            {Object.entries(EXAM_TREE).map(([key, category]) => (
              <button
                key={key}
                style={{
                  ...styles.button,
                  ...styles.listButton,
                  fontWeight: examState.selectedCategory === key ? "bold" : "normal"
                }}
                onClick={() => onSelectCategory(key)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <strong>{selectedExamCategory.title}</strong>
          <div style={styles.listColumn}>
            {selectedExamCategory.items.map((item) => (
              <button
                key={item.id}
                style={{ ...styles.button, ...styles.listButton }}
                onClick={() => onPerformExam(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
