import { familyLaw, immigrationLaw } from "./lawCategoryService";
import { feeType_OptionalUnit } from "./additionalFeeService";
import { notApplicable } from "./londonRateService";

/**
 * Ask API for calculation detials
 * @async
 * @param {object} sessionData - data user has entered previously
 * @param {import('middleware-axios').AxiosInstanceWrapper} axios - axios middleware instance
 * @returns {object} - api response
 * @throws {Error} - if api call fails or data missing
 */
export async function getCalculationResult(sessionData, axios) {
  const requestBody = getRequest(sessionData);

  const response = await axios.get("/fees/calculate", { data: requestBody });
  const result = response.data;

  return {
    amount: result.amount,
    total: result.total,
    vat: result.vat,
  };
}

/**
 * Create request
 * @param {object} sessionData - data user has entered
 * @returns {object} request to send to service
 */
function getRequest(sessionData) {
  switch (sessionData.lawCategory) {
    case familyLaw:
      return createFamilyRequest(sessionData);

    case immigrationLaw:
      return createImmigrationRequest(sessionData);

    default:
      throw new Error("Unsupported law category");
  }
}

/**
 * Create request for Family Law
 * @param {object} sessionData - data user has entered
 * @returns {object} request to send to service
 */
function createFamilyRequest(sessionData) {
  const matterCode1 = sessionData.matterCode1;
  const matterCode2 = sessionData.matterCode2;
  const caseStage = sessionData.caseStage;
  const locationCode = sessionData.londonRate;

  if (
    matterCode1 == null ||
    matterCode2 == null ||
    locationCode == null ||
    caseStage == null
  ) {
    throw new Error("Data is missing");
  }

  const requestBody = {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
    locationCode: locationCode,
    caseStage: caseStage,
  };

  return requestBody;
}

/**
 * Create request for Immigration Law
 * @param {object} sessionData - data user has entered
 * @returns {object} request to send to service
 */
function createImmigrationRequest(sessionData) {
  const matterCode1 = sessionData.matterCode1;
  const matterCode2 = sessionData.matterCode2;
  const caseStage = sessionData.caseStage;
  const validAdditionalFees = sessionData.validAdditionalFees;
  const additionalCosts = sessionData.additionalCosts;

  let responseLevelCodes = [];

  if (matterCode1 == null || matterCode2 == null || caseStage == null) {
    throw new Error("Data is missing");
  }

  if (validAdditionalFees != null && validAdditionalFees.length > 0) {
    if (additionalCosts == null) {
      throw new Error("Additional cost data is missing");
    }

    const optionalUnitFees = getOptionalUnitFees(validAdditionalFees);

    if (optionalUnitFees.length != additionalCosts.length) {
      throw new Error(
        "Expected ${optionalUnitFees.length} additional fees but got ${additionalCosts.length}",
      );
    }

    for (const fee of optionalUnitFees) {
      const enteredFee = additionalCosts.find(
        (cost) => cost.levelCode === fee.levelCode,
      );

      if (enteredFee == null) {
        throw new Error(
          "Expected user to have entered value for ${fee.levelCode}",
        );
      }

      responseLevelCodes.push({
        levelCode: fee.levelCode,
        units: enteredFee.value,
      });
    }
  }

  const requestBody = {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
    locationCode: notApplicable,
    caseStage: caseStage,
    levelCodes: responseLevelCodes,
  };
  return requestBody;
}

//TODO Dup code
/**
 * Filter out the OptionalUnit fields
 * @param {Array<object>} additionalFees - additional fees to filter
 * @returns {Array<object>} - fields with OptionalUnit
 */
function getOptionalUnitFees(additionalFees) {
  return additionalFees.filter((fee) => fee.type === feeType_OptionalUnit);
}
