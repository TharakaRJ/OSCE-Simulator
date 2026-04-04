export const EXAM_TREE = {
  general: {
    title: "General Inspection",
    items: [
      { id: "gen_overall", label: "Look at the patient overall" },
      { id: "gen_distress", label: "Assess distress" },
      { id: "gen_sweating", label: "Assess sweating" },
      { id: "gen_responsive", label: "Assess responsiveness" }
    ]
  },
  cardio: {
    title: "Cardiovascular Examination",
    items: [
      { id: "cv_pulse", label: "Check pulse" },
      { id: "cv_bp", label: "Recheck blood pressure" },
      { id: "cv_heart", label: "Auscultate heart sounds" },
      { id: "cv_jvp", label: "Check JVP" }
    ]
  },
  resp: {
    title: "Respiratory Examination",
    items: [
      { id: "resp_inspect", label: "Inspect breathing" },
      { id: "resp_ausc", label: "Auscultate lungs" }
    ]
  },
  peripheral: {
    title: "Peripheral Examination",
    items: [
      { id: "per_caprefill", label: "Check capillary refill" },
      { id: "per_pulses", label: "Check peripheral pulses" },
      { id: "per_legs", label: "Check leg swelling" }
    ]
  },
  monitor: {
    title: "Vitals Review",
    items: [{ id: "mon_review", label: "Review monitor readings" }]
  }
};
