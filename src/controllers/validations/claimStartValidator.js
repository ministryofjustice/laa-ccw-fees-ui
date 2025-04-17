import { isValidLawCategory } from "../../service/lawCategoryService";
import { validateEnteredDate } from "../../utils/dateTimeUtils";

/**
 * Validate claim start date and category
 * @param {string} date - date entered
 * @param {string} category - category entered
 * @returns {object} - any errors
 */
export function validateClaimStart(date, category) {
  let errors = { list: [], messages: {} };

  const dateError = checkDate(date);
  if (dateError) {
    const text = `'Date case was opened' ${dateError}`;
    errors.list.push({ href: "#date", text });
    errors.messages.date = { text };
  }

  const categoryError = checkCategory(category);
  if (categoryError) {
    const text = `'Law Category' ${categoryError}`;
    errors.list.push({ href: "#category", text });
    errors.messages.category = { text };
  }
  return errors;
}

/**
 * Check date entered
 * @param {string} date - the Date
 * @returns {string} - the error message
 */
function checkDate(date) {
  if (!date) {
    return "not entered";
  }

  return validateEnteredDate(date);
}

/**
 * Check category entered
 * @param {string} category - the category
 * @returns {string} - the error message
 */
function checkCategory(category) {
  if (!category) {
    return "not entered";
  }

  if (!isValidLawCategory(category)) {
    return "is not valid";
  }

  return null;
}
