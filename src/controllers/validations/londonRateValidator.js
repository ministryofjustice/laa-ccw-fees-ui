import { isValidLondonRate } from "../../service/londonRateService.js";

/**
 * Check entered london rate
 * @param {string} londonRate - london rate entered
 * @returns {object} - any errors
 */
export function validateLondonRate(londonRate) {
  let errors = { list: [], messages: {} };

  const londonRateError = checkLondonRate(londonRate);
  if (londonRateError) {
    const text = `'London/Non-London Rate' ${londonRateError}`;
    errors.list.push({ href: "#londonRate", text });
    errors.messages.londonRate = { text };
  }

  return errors;
}

/**
 * Check london rate entered
 * @param {string} londonRate - the london rate
 * @returns {string} - the error message
 */
function checkLondonRate(londonRate) {
  if (!londonRate) {
    return "not entered";
  }

  if (!isValidLondonRate(londonRate)) {
    return "is not valid";
  }

  return null;
}
