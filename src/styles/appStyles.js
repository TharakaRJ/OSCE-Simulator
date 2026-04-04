export const styles = {
  // ── Design tokens ─────────────────────────────────────────────────────────
  // body: 13px/1.5  |  bg-page: #0b0f17  |  bg-panel: #111828  |  bg-surface: #161d2a
  // border: #2e3550  |  text: #d8dde8  |  muted: #7a8799  |  accent: #7ecfff

  // ── Page shell ─────────────────────────────────────────────────────────────
  page: {
    padding: "10px 24px",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    fontSize: 13,
    lineHeight: 1.5,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    background: "#0b0f17",
    color: "#d8dde8",
    minHeight: "100vh"
  },

  // ── Titles ─────────────────────────────────────────────────────────────────
  title: {
    marginBottom: 12,
    fontSize: 15,
    fontWeight: 600,
    color: "#f0f4fa",
    letterSpacing: "0.02em"
  },

  // ── Centered Screen Layouts ────────────────────────────────────────────────
  centeredScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "75vh",
    width: "100%",
    gap: 20
  },
  centeredPanel: {
    border: "1px solid #2e3550",
    borderRadius: 8,
    padding: "24px 32px",
    background: "#111828",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: 400,
    boxSizing: "border-box"
  },

  // ── Menu screen ────────────────────────────────────────────────────────────
  menuHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 16,
    textAlign: "center"
  },
  menuTitle: {
    fontSize: 38,
    fontWeight: 700,
    color: "#f0f4fa",
    letterSpacing: "-0.5px",
    margin: 0
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#7a8799",
    margin: 0
  },
  menuButton: {
    padding: "11px 28px",
    borderRadius: 8,
    border: "1px solid #3a4560",
    background: "#1c2a40",
    color: "#7ecfff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
    letterSpacing: "0.03em"
  },

  // ── Cue card ───────────────────────────────────────────────────────────────
  cueCard: {
    border: "1px solid #2e3550",
    borderRadius: 8,
    padding: "14px 18px",
    background: "#111828",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 520
  },
  cueRow: {
    display: "flex",
    gap: 12,
    fontSize: 13,
    alignItems: "baseline"
  },
  cueLabel: {
    color: "#7a8799",
    fontWeight: 600,
    minWidth: 80,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },

  // ── Buttons ────────────────────────────────────────────────────────────────
  button: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #2e3550",
    background: "#1c2235",
    color: "#d8dde8",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    lineHeight: 1.4
  },
  listButton: {
    width: "100%",
    boxSizing: "border-box",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "normal",
    textAlign: "left"
  },
  smallButton: {
    padding: "4px 9px",
    borderRadius: 5,
    border: "1px solid #2e3550",
    background: "#1c2235",
    color: "#d8dde8",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    lineHeight: 1.4
  },
  compactButton: {
    padding: "5px 9px",
    fontSize: 11,
    lineHeight: 1.3
  },
  compactPanelButton: {
    padding: "7px 12px",
    fontSize: 11,
    lineHeight: 1.35
  },
  endStationButton: {
    background: "#2a1520",
    border: "1px solid #5a2535",
    color: "#f08080"
  },

  // ── Shared panel/section ───────────────────────────────────────────────────
  section: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    minWidth: 0,
    boxSizing: "border-box"
  },

  // ── Simulation top bar ─────────────────────────────────────────────────────
  simTopBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap"
  },
  simAppTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#7ecfff",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap"
  },

  // ── Action bars ────────────────────────────────────────────────────────────
  actionBar: {
    marginBottom: 10,
    display: "flex",
    gap: 7,
    flexWrap: "wrap"
  },
  primaryActionBar: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },

  // ── Simulation layout ──────────────────────────────────────────────────────
  simulationLayout: {
    display: "grid",
    gridTemplateColumns: "520px minmax(240px, 1fr) 240px auto",
    gap: 12,
    alignItems: "stretch",
    width: "100%",
    maxWidth: "100%",
    minHeight: 0
  },
  mainColumn: {
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minHeight: 0
  },
  patientStateCard: {
    border: "1px solid #2e3550",
    borderRadius: 8,
    padding: "10px 12px",
    background: "#111828",
    color: "#d8dde8",
    boxSizing: "border-box",
    width: "min(100%, 520px)",
    maxWidth: 520,
    boxShadow: "0 16px 30px rgba(0,0,0,0.22)"
  },
  patientStateCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #334e68"
  },
  patientStateCardIcon: {
    color: "#7ecfff",
    fontSize: 13,
    lineHeight: 1
  },
  patientStateCardTitle: {
    fontWeight: 700,
    color: "#fff",
    fontSize: 13,
    letterSpacing: "0.04em",
    textTransform: "uppercase"
  },
  patientVisualColumn: {
    minWidth: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 18,
    minHeight: 0
  },
  patientImageWrap: {
    width: "min(100%, 380px)",
    height: 332,
    backgroundColor: "#1e3050",
    borderRadius: 8,
    overflow: "hidden",
    border: "2px solid #334e68",
    boxShadow: "0 18px 36px rgba(0,0,0,0.28)",
    flexShrink: 0
  },

  // ── Patient State box ──────────────────────────────────────────────────────
  stateBox: {
    marginBottom: 10,
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: "10px 12px",
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden"
  },
  boxHeading: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#7a8799",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 8
  },
  stateGrid: {
    display: "flex",
    gap: "6px 20px",
    flexWrap: "wrap",
    marginBottom: 6,
    justifyContent: "center"
  },
  stateItem: {
    display: "flex",
    gap: 6,
    alignItems: "baseline"
  },
  stateKey: {
    fontSize: 11,
    fontWeight: 600,
    color: "#7a8799",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  stateStatusArea: {
    minHeight: 24,
    marginTop: 4,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden"
  },

  // ── ABCDE panel ────────────────────────────────────────────────────────────
  abcdeShell: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    width: "min(100%, 520px)",
    minWidth: 0,
    maxWidth: 520,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "hidden"
  },
  abcdeGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  abcdeSection: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    padding: "5px 8px",
    borderRadius: 6,
    background: "#0e1520",
    border: "1px solid #232f45",
    minHeight: 56,
    boxSizing: "border-box"
  },
  abcdeLetter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 54,
    minWidth: 54,
    flexShrink: 0
  },
  abcdeLetterBig: {
    fontSize: 16,
    fontWeight: 800,
    color: "#7ecfff",
    lineHeight: 1
  },
  abcdeLetterLabel: {
    fontSize: 8,
    color: "#7a8799",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    textAlign: "center"
  },
  abcdeActions: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    flex: 1,
    minWidth: 0
  },
  abcdeActionButton: {
    width: "auto",
    minWidth: 132,
    maxWidth: "100%",
    flex: "0 1 auto",
    textAlign: "left",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "normal"
  },

  // ── Drawer shells ──────────────────────────────────────────────────────────
  fixedDrawerShell: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 8,
    marginBottom: 0,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    minHeight: 0,
    width: "min(100%, 520px)",
    minWidth: 0,
    maxWidth: 520,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1
  },
  drawerShell: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    width: "min(100%, 520px)",
    minWidth: 0,
    maxWidth: 520,
    boxSizing: "border-box",
    overflow: "hidden"
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexShrink: 0,
    minWidth: 0
  },
  drawerHeaderButtons: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    flexShrink: 0
  },
  drawerBody: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    flex: 1,
    overflow: "hidden",
    width: "100%",
    minWidth: 0
  },
  drawerScrollableArea: {
    flex: 1,
    minHeight: 0,
    overflowY: "hidden",
    overflowX: "hidden",
    paddingRight: 4,
    paddingBottom: 12,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  },
  drawerList: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  },
  historyTwoColGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 5,
    marginBottom: 6,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  },
  historyWideGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 5,
    marginBottom: 8,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  },
  historyDenseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 5,
    marginBottom: 8,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  },
  historySingleQuestionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 6,
    marginBottom: 8,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    justifyContent: "start"
  },
  historyQuestionButton: {
    width: "100%",
    minHeight: 48,
    boxSizing: "border-box",
    textAlign: "left",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "normal"
  },
  historyDenseQuestionButton: {
    width: "100%",
    minHeight: 42,
    boxSizing: "border-box",
    textAlign: "left",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "normal"
  },
  historySingleQuestionButton: {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    minHeight: 38,
    justifySelf: "stretch",
    textAlign: "left",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "normal"
  },
  drawerSubheading: {
    color: "#c0c9d8",
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 8,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word"
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "5px 10px",
    marginBottom: 6,
    borderRadius: 6,
    border: "1px solid #2e3550",
    background: "#0d1219",
    color: "#d8dde8",
    fontSize: 13,
    fontFamily: "inherit"
  },
  fixedResponseBox: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    minHeight: 80,
    maxHeight: 80,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflow: "hidden"
  },
  fixedResponseContent: {
    marginTop: 5,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    fontSize: 13,
    lineHeight: 1.5,
    flex: 1,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%"
  },

  // ── legacy boxes (kept for safety) ─────────────────────────────────────────
  logBox: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    background: "#111828",
    minHeight: 90,
    color: "#d8dde8",
    fontSize: 13,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden"
  },
  responseBox: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden"
  },
  sideDrawerWrap: {
    position: "sticky",
    top: 14,
    alignSelf: "start",
    width: 290,
    minWidth: 290,
    maxWidth: 290,
    boxSizing: "border-box"
  },
  drawerTabButton: {
    width: "100%",
    padding: "7px 12px",
    borderRadius: 7,
    border: "1px solid #2e3550",
    background: "#1c2235",
    color: "#d8dde8",
    cursor: "pointer",
    fontSize: 12,
    marginBottom: 7,
    boxSizing: "border-box"
  },
  sideDrawerPanel: {
    border: "1px solid #2e3550",
    borderRadius: 7,
    padding: 10,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden"
  },

  // ── Grids ──────────────────────────────────────────────────────────────────
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1.35fr 1fr",
    gap: 10,
    marginBottom: 10
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 10
  },
  compactTwoColumn: {
    display: "grid",
    gridTemplateColumns: "220px minmax(0, 1fr)",
    gap: 10,
    marginBottom: 10,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  },
  listColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginTop: 7,
    minWidth: 0
  },

  // ── Utility text styles ─────────────────────────────────────────────────────
  wrappedText: {
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    minWidth: 0,
    maxWidth: "100%",
    fontSize: 13,
    lineHeight: 1.5
  },
  mutedText: {
    color: "#7a8799",
    fontSize: 13,
    lineHeight: 1.5,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word"
  },
  warningText: {
    color: "#ff8a80",
    fontWeight: 600,
    fontSize: 13,
    marginTop: 5,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word"
  },
  cueText: {
    color: "#c0c9d8",
    fontStyle: "italic",
    fontSize: 13
  },

  // ── Right combined panel ────────────────────────────────────────────────────
  rightPanel: {
    position: "sticky",
    top: 14,
    alignSelf: "start",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #2e3550",
    borderRadius: 7,
    background: "#111828",
    color: "#d8dde8",
    boxSizing: "border-box",
    overflow: "hidden",
    height: "calc(100vh - 90px)",
    maxHeight: 680,
    minHeight: 360,
    width: 240,
    minWidth: 240,
    maxWidth: 240
  },

  /* Clinical Communication (top) */
  commSection: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minHeight: 0,
    padding: 10,
    overflow: "hidden"
  },
  commTitle: {
    color: "#7ecfff",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    flexShrink: 0,
    display: "block",
    marginBottom: 7
  },
  commFeed: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 7,
    paddingRight: 3
  },
  commEmpty: {
    color: "#3d4a5e",
    fontStyle: "italic",
    fontSize: 12,
    lineHeight: 1.5
  },
  commEntry: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    borderLeft: "2px solid #1e3050",
    paddingLeft: 7
  },
  commSpeaker: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase"
  },
  commLine: {
    fontSize: 13,
    color: "#c8d2e0",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    lineHeight: 1.5
  },

  /* Divider */
  panelDivider: {
    height: 1,
    background: "#1e2d40",
    flexShrink: 0
  },

  /* Clinical Updates (bottom) */
  updatesSection: {
    display: "flex",
    flexDirection: "column",
    height: 175,
    flexShrink: 0,
    padding: 10,
    overflow: "hidden"
  },
  updatesTitle: {
    color: "#8fa8c0",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    flexShrink: 0,
    display: "block",
    marginBottom: 7
  },
  updatesFeed: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    paddingRight: 3
  },

  // ── Investigations tab ──────────────────────────────────────────────────────
  investigationsTabWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0
  },
  investigationsTabIcon: {
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    padding: "14px 9px",
    borderRadius: "0 6px 6px 0",
    border: "1px solid #2e3550",
    borderLeft: "none",
    background: "#161d2a",
    color: "#8fa8c0",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    letterSpacing: "0.04em",
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  investigationsTabLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5
  },
  investigationsTabText: {
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700
  },
  // Opens leftward from the tab so it always stays in viewport
  investigationsPanel: {
    position: "fixed",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 280,
    zIndex: 200,
    border: "1px solid #2e3550",
    borderRadius: "8px 0 0 8px",
    padding: 12,
    background: "#111828",
    color: "#d8dde8",
    fontSize: 13,
    boxSizing: "border-box",
    boxShadow: "-6px 0 32px rgba(0,0,0,0.55)",
    maxHeight: "80vh",
    overflowY: "auto"
  },

  // ── Patient State Hover Tab ────────────────────────────────────────────────
  patientStateTabWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 0
  },
  patientStateTabHotspot: {},
  patientStateDrawer: {},
  patientStateTabIcon: {},
  patientStateTabLabel: {},
  patientStateTabBadge: {},
  patientStateTabText: {},
  patientStatePanel: {}
};
