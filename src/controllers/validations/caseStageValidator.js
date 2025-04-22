import { isValidCaseStage } from "../../service/caseStageService.js";

/**
 * Validate entered case stage
 * @param {Array[Object]} validCaseStages - list of valid case stages
 * @param {string} caseStage - case stage entered
 * @returns {object} - any errors
 */
export function validateCaseStage(validCaseStages, caseStage) {
  let errors = { list: [], messages: {} };

  const caseStageError = checkCaseStage(validCaseStages, caseStage);
  if (caseStageError) {
    const text = `'Case Stage / Level' ${caseStageError}`;
    errors.list.push({ href: "#caseStage", text });
    errors.messages.caseStage = { text };
  }

  return errors;
}

/**
 * Check case stage entered
 * @param {Array[Object]} validCaseStages - list of valid case stages
 * @param {string} caseStage - the case stage
 * @returns {string} - the error message
 */
function checkCaseStage(validCaseStages, caseStage) {
  if (!caseStage) {
    return "not entered";
  }

  if (!isValidCaseStage(validCaseStages, caseStage)) {
    return "is not valid";
  }

  return null;
}
