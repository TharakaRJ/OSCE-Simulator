import { useMemo, useState } from "react";
import { HISTORY_TREE } from "../data/historyTree";
import { styles } from "../styles/appStyles";

export function HistoryPanel({ historyState, onSelectCategory, onAskQuestion, onClose }) {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedHistoryCategory = HISTORY_TREE[historyState.selectedCategory];

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];

    const results = [];

    Object.entries(HISTORY_TREE).forEach(([categoryKey, category]) => {
      const categoryMatches = category.title.toLowerCase().includes(term);

      category.questions.forEach((question) => {
        const questionMatches =
          question.label.toLowerCase().includes(term) || question.text.toLowerCase().includes(term);

        if (categoryMatches || questionMatches) {
          results.push({
            categoryKey,
            categoryTitle: category.title,
            question
          });
        }
      });
    });

    return results;
  }, [searchTerm]);

  function handleCategorySelect(categoryKey) {
    onSelectCategory(categoryKey);
    setStep(2);
  }

  function handleBack() {
    if (searchTerm.trim()) {
      setSearchTerm("");
      setStep(1);
      return;
    }

    if (step > 1) {
      setStep(step - 1);
    }
  }

  function handleQuestionSelect(question, categoryKey = historyState.selectedCategory) {
    if (categoryKey !== historyState.selectedCategory) {
      onSelectCategory(categoryKey);
    }

    onAskQuestion(question);
    setStep(2);
  }

  const canGoBack = step > 1 || searchTerm.trim().length > 0;
  const questionGridStyle = (() => {
    if (historyState.selectedCategory === "presentingComplaint") {
      return styles.historySingleQuestionGrid;
    }

    if (historyState.selectedCategory === "associatedSymptoms") {
      return styles.historyWideGrid;
    }

    if (historyState.selectedCategory === "hpc") {
      return styles.historyDenseGrid;
    }

    return styles.historyTwoColGrid;
  })();
  const questionButtonStyle =
    historyState.selectedCategory === "presentingComplaint"
      ? {
          ...styles.button,
          ...styles.compactPanelButton,
          ...styles.historySingleQuestionButton
        }
      : historyState.selectedCategory === "hpc"
        ? {
            ...styles.button,
            ...styles.compactPanelButton,
            ...styles.historyDenseQuestionButton
          }
      : {
          ...styles.button,
          ...styles.compactPanelButton,
          ...styles.historyQuestionButton
        };

  return (
    <div style={styles.fixedDrawerShell}>
      <div style={styles.drawerHeader}>
        <strong>Take History</strong>
        <div style={styles.drawerHeaderButtons}>
          {canGoBack && (
            <button style={styles.smallButton} onClick={handleBack}>
              Back
            </button>
          )}
          <button style={styles.smallButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div style={styles.drawerBody}>
        <div style={styles.drawerScrollableArea}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search history..."
            style={styles.searchInput}
          />

          {searchTerm.trim() ? (
            <div style={styles.drawerList}>
              {searchResults.length === 0 ? (
                <div style={styles.mutedText}>No matching history items found.</div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={`${result.categoryKey}-${result.question.id}`}
                    style={{ ...styles.button, ...styles.listButton }}
                    onClick={() => handleQuestionSelect(result.question, result.categoryKey)}
                  >
                    {result.categoryTitle} → {result.question.label}
                  </button>
                ))
              )}
            </div>
          ) : step === 1 ? (
            <div style={styles.drawerList}>
              {Object.entries(HISTORY_TREE).map(([key, category]) => (
                <button
                  key={key}
                  style={{
                    ...styles.button,
                    ...styles.listButton,
                    fontWeight: historyState.selectedCategory === key ? "bold" : "normal"
                  }}
                  onClick={() => handleCategorySelect(key)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div style={styles.drawerSubheading}>{selectedHistoryCategory.title}</div>
              <div style={questionGridStyle}>
                {selectedHistoryCategory.questions.map((question) => (
                  <button
                    key={question.id}
                    style={questionButtonStyle}
                    onClick={() => handleQuestionSelect(question)}
                  >
                    {question.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
