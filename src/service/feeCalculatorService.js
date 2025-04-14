import { familyLaw, immigrationLaw } from "./lawCategoryService";
import { feeTypes, getDisplayableFees } from "./additionalFeeService";
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
    total: result.total, // = amount + vat
    vat: result.vat,
    feeBreakdown: result.fees
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
    // We are expecting some add ons to be there

    if (additionalCosts == null) {
      throw new Error("Additional cost data is missing");
    }

    const displayableFees = getDisplayableFees(validAdditionalFees);

    if (displayableFees.length != additionalCosts.length) {
      // We expected them to fill in x additional fees but they only answered y
      throw new Error(
        "Expected ${optionalUnitFees.length} additional fees but got ${additionalCosts.length}",
      );
    }

    for (const fee of displayableFees) {
      const enteredFee = additionalCosts.find(
        (cost) => cost.levelCode === fee.levelCode,
      );

      if (enteredFee == null) {
        // Expected an answer for a given fee but don't have it
        throw new Error(
          "Expected user to have entered value for ${fee.levelCode}",
        );
      }

      switch (fee.levelCodeType) {
        case feeTypes.optionalFee:
          responseLevelCodes.push({
            levelCode: fee.levelCode,
            fee: enteredFee.value,
          });
          break;
        case feeTypes.optionalUnit:
          responseLevelCodes.push({
            levelCode: fee.levelCode,
            units: enteredFee.value,
          });
          break;
        case feeTypes.optionalBool:
          //No need to send false ones. Sending it will cause it to be added to the calculation
          if (enteredFee.value == true)
            responseLevelCodes.push({
              levelCode: fee.levelCode,
            });
          break;
        default:
          throw new Error("Unexpected fee type ${fee.levelCodeType}");
      }
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
