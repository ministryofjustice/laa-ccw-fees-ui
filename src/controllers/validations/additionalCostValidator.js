import { feeTypes } from "../../service/feeDetailsService";

/**
 * Check entered additional cost is valid and return the cleaned up value
 * @param {string} initialValue - value user entered
 * @param {object} fieldDetails - field we are validating
 * @returns {string} - cleaned up value
 * @throws {Error} - if not valid
 */
export function validateAndReturnAdditionalCostValue(
  initialValue,
  fieldDetails,
) {
  if (initialValue == null) {
    throw new Error(fieldDetails.levelCode + " not defined");
  }

  switch (fieldDetails.levelCodeType) {
    case feeTypes.optionalFee:
      if (initialValue.trim() == "") {
        // Allowed to skip this field if you have no fee
        return "0";
      }

      if (!isValidFeeEntered(initialValue)) {
        throw new Error(
          fieldDetails.levelCode + " must be a currency value or empty",
        );
      }

      return initialValue;

    case feeTypes.optionalUnit:
      if (!isValidUnitEntered(initialValue)) {
        throw new Error(
          fieldDetails.levelCode + " must be an integer between 0 and 9",
        );
      }
      return initialValue;

    case feeTypes.optionalBool:
      if (initialValue === "yes") {
        return true;
      } else if (initialValue === "no") {
        return false;
      } else {
        throw new Error(fieldDetails.levelCode + " is not valid");
      }

    default:
      throw new Error("Unexpected fee type: " + fieldDetails.levelCodeType);
  }
}

/**
 * Check Optional_Fee field has valid value (currency)
 * @param {string} value - user entered value
 * @returns {boolean} - true if valid, false otherwise
 */
function isValidFeeEntered(value) {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(value);
}

/**
 * Check Optional_Unit field has valid value (int between 0 to 9)
 * @param {string} value - user entered value
 * @returns {boolean} - true if valid, false otherwise
 */
function isValidUnitEntered(value) {
  const regex = /^\d{1}?$/;
  return regex.test(value);
}
