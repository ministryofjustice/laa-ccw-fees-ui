import { isValidMatterCode1 } from "../../service/matterCode1Service.js";

/**
 * Validate entered matter code 1
 * @param {Array[Object]} validMatterCode1s - list of valid matter codes
 * @param {string} matterCode1 - matter code 1 entered
 * @returns {object} - any errors
 */
export function validateMatterCode1(validMatterCode1s, matterCode1) {
  let errors = { list: [], messages: {} };

  const matterCode1Error = checkMatterCode1(validMatterCode1s, matterCode1);
  if (matterCode1Error) {
    const text = `'Matter Code 1' ${matterCode1Error}`;
    errors.list.push({ href: "#matterCode1", text });
    errors.messages.matterCode1 = { text };
  }

  return errors;
}

/**
 * Check matter code 1 entered
 * @param {Array[Object]} validMatterCode1s - list of valid matter codes
 * @param {string} matterCode1 - the matter code 1
 * @returns {string} - the error message
 */
function checkMatterCode1(validMatterCode1s, matterCode1) {
  if (!matterCode1) {
    return "not entered";
  }

  if (!isValidMatterCode1(validMatterCode1s, matterCode1)) {
    return "is not valid";
  }

  return null;
}
