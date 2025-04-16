import { isValidMatterCode2 } from "../../service/matterCode2Service.js";

/**
 * Check entered matter Code 2
 * @param {Array[Object]} validMatterCode2s - list of valid matter codes
 * @param {string} matterCode2 - matter Code 2 entered
 * @returns {object} - any errors
 */
export function validateMatterCode2(validMatterCode2s, matterCode2) {
  let errors = { list: [], messages: {} };

  const matterCode1Error = checkMatterCode2(validMatterCode2s, matterCode2);
  if (matterCode1Error) {
    const text = `'Matter Code 2' ${matterCode1Error}`;
    errors.list.push({ href: "#matterCode2", text });
    errors.messages.matterCode2 = { text };
  }

  return errors;
}

/**
 * Check category entered
 * @param {Array[Object]} validMatterCode2s - list of valid matter codes
 * @param {string} matterCode2 - the matter Code 2
 * @returns {string} - the error message
 */
function checkMatterCode2(validMatterCode2s, matterCode2) {
  if (!matterCode2) {
    return "not entered";
  }

  if (!isValidMatterCode2(validMatterCode2s, matterCode2)) {
    return "is not valid";
  }

  return null;
}
