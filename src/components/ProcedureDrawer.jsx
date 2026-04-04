import { useMemo, useState } from "react";
import { styles } from "../styles/appStyles";

const PROCEDURE_ITEMS = [
  { id: "request_monitoring", label: "Request Monitoring", actionKey: "requestMonitoring" },
  { id: "request_iv", label: "Request IV Access", actionKey: "requestIVAccess" },
  { id: "give_aspirin", label: "Give Aspirin", actionKey: "giveAspirin" },
  { id: "give_analgesia", label: "Give Analgesia", actionKey: "giveAnalgesia" },
  { id: "give_oxygen", label: "Give Oxygen", actionKey: "giveOxygen" },
  { id: "give_nitroglycerin", label: "Give Nitroglycerin", actionKey: "giveNitroglycerin" },
  { id: "request_ecg", label: "Request ECG", actionKey: "requestECG" },
  { id: "request_bloods", label: "Request Bloods", actionKey: "requestBloods" },
  { id: "call_for_help", label: "Call for Help", actionKey: "callForHelp" },
  { id: "position_patient", label: "Position Patient", actionKey: "positionPatient" }
];

export function ProcedureDrawer({ actions, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return PROCEDURE_ITEMS;

    return PROCEDURE_ITEMS.filter((item) => item.label.toLowerCase().includes(term));
  }, [searchTerm]);

  return (
    <div style={styles.fixedDrawerShell}>
      <div style={styles.drawerHeader}>
        <strong>Perform Procedure</strong>
        <button style={styles.smallButton} onClick={onClose}>
          Close
        </button>
      </div>

      <div style={styles.drawerBody}>
        <div style={styles.drawerScrollableArea}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search procedures..."
            style={styles.searchInput}
          />

          <div style={{ ...styles.drawerList, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {filteredItems.length === 0 ? (
              <div style={styles.mutedText}>No matching procedures found.</div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  style={{ ...styles.button, ...styles.listButton }}
                  onClick={() => actions[item.actionKey]()}
                >
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
