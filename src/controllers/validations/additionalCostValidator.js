import { feeTypes } from "../../service/feeDetailsService";

/**
 * Check entered additional cost is valid and return the cleaned up value
 * @param {string} initialValue - value user entered
 * @param {object} fieldDetails - field we are validating
 * @returns {object} - cleaned up value or error
 */
export function validateAndReturnAdditionalCostValue(
  initialValue,
  fieldDetails,
) {
  if (initialValue == null) {
    return { error: "not entered" };
  }

  switch (fieldDetails.levelCodeType) {
    case feeTypes.optionalFee:
      if (initialValue.trim() === "") {
        // Allowed to skip this field if you have no fee
        return { value: "0" };
      }

      if (!isValidFeeEntered(initialValue)) {
        return { error: "is not valid" };
      }

      return { value: initialValue };

    case feeTypes.optionalUnit:
      if (!isValidUnitEntered(initialValue)) {
        return { error: "must be a number between 0 and 9" };
      }
      return { value: initialValue };

    case feeTypes.optionalBool:
      if (initialValue === "yes") {
        return { value: true };
      } else if (initialValue === "no") {
        return { value: false };
      } else {
        return { error: "is not valid" };
      }

    default:
      return { error: "is not valid" };
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
