import { format, isValid, parse } from "date-fns";
const DATE_FORMAT = "dd/MM/yyyy";

/**
 * Return today's date in GB format
 * @returns {string} today's date
 */
export function todayString() {
  return format(new Date(), DATE_FORMAT);
}

/**
 * Prepend month and date with 0 if single-digit provided
 * @param {string} inputDate - date user entered in form
 * @returns {string} - same date with additional 0 padding if necessary
 */
function addMissingZeroes(inputDate) {
  const [day, month, year] = inputDate.split("/");

  if (day == null || month == null || year == null) {
    //Not in right format
    throw new DateInputError("Date is not in dd/MM/yyyy format");
  }

  // Ensure 0 added if needed to match the format
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");

  return `${paddedDay}/${paddedMonth}/${year}`;
}

/**
 * Check date user entered is valid - correct format, a real date and not in the future
 * @param {string} inputDate - date user entered
 * @returns {boolean} true if valid date
 * @throws {DateInputError} with error context
 */
export function validateEnteredDate(inputDate) {
  const formattedInput = addMissingZeroes(inputDate);
  const parsedDate = parse(formattedInput, DATE_FORMAT, new Date());

  // Check date is valid
  if (!isValid(parsedDate)) {
    throw new DateInputError("Date is not a valid date");
  }

  if (parsedDate > new Date()) {
    throw new DateInputError("Date cannot be in the future");
  }

  // Make sure it matches - handles some edge cases around timezones, weird formats, etc
  const formattedDate = format(parsedDate, DATE_FORMAT);

  if (formattedDate !== formattedDate) {
    throw new DateInputError("Date parsing has failed");
  }

  return true;
}

/**
 * Error wrapper for user date input issues
 */
class DateInputError extends Error {
  /**
   * Create DateInputError
   * @param {string} message - reason date is invalid
   */
  constructor(message) {
    super("Date input error: " + message);
  }
}
