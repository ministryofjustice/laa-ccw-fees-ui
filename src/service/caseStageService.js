//TODO will be api call in future

const caseStages = [
  {
    id: "FPL01",
    description: "FPL01: Level 1",
  },
  {
    id: "FPL02",
    description: "FPL02: Level 1 + Level 2 children + Settlement fee children",
  },
  {
    id: "FPL03",
    description: "FPL03: Level 1 + Level 2 finance + Settlement fee finance",
  },
];

/**
 * Gets the valid case stages
 * @returns {Array[]} - the valid case stages
 */
export function getCaseStages() {
  return caseStages;
}

/**
 * Check an entered case stage is valid
 * @param {string} enteredCaseStage - case stage user selected
 * @returns {boolean} - true if case stage is valid, false otherwise
 */
export function isValidCaseStage(enteredCaseStage) {
  return caseStages.some((caseStage) => caseStage.id === enteredCaseStage);
}
