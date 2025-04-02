//TODO will be api call in future

const caseStages = [
    {
      id: "LVL1",
      description: "Level 1",
    },
    {
      id: "LVL2C",
      description: "Level 2 Children",
    },
    {
        id: "LVL2F",
        description: "Level 2 Finance",
      }
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
  