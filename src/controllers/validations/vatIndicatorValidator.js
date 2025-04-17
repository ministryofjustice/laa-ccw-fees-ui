/**
 * Validate entered vat indicator
 * @param {string} vatIndicator - vat indicator entered
 * @returns {object} - any errors
 */
export function validateVatIndicator(vatIndicator) {
  let errors = { list: [], messages: {} };

  const vatIndicatorError = checkLondonRate(vatIndicator);
  if (vatIndicatorError) {
    const text = `'London/Non-London Rate' ${vatIndicatorError}`;
    errors.list.push({ href: "#vatIndicator", text });
    errors.messages.vatIndicator = { text };
  }

  return errors;
}

/**
 * Check vat indicator entered
 * @param {string} vatIndicator - the vat indicator
 * @returns {string} - the error message
 */
function checkLondonRate(vatIndicator) {
  if (!vatIndicator) {
    return "not entered";
  }

  if (vatIndicator !== "yes" && vatIndicator !== "no") {
    return "is not valid";
  }

  return null;
}
