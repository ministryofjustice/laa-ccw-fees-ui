import { immigrationLaw } from "./lawCategoryService";
import { notApplicable } from "./londonRateService";

export const feeTypes = {
  automatic: "A",
  optionalBool: "O",
  optionalUnit: "OU",
  optionalFee: "OF",
};

/**
 * Gets the additional fees (bolt ons)
 * @param {import('express').Request} req Express request object
 * @returns {Promise<Array[]>} - the valid case stage
 * @async
 */
export async function getAdditionalFees(req) {
  if (req.session.data.validAdditionalFees == null) {
    req.session.data.validAdditionalFees = await getAdditionalFeesFromService(
      req.axiosMiddleware,
      req.session.data.matterCode1,
      req.session.data.matterCode2,
      req.session.data.caseStage,
      req.session.data.lawCategory,
      req.session.data.londonRate
    );
  }

  return req.session.data.validAdditionalFees;
}

/**
 * Get the additional fees (bolt ons) from the backend service
 * @param {import('middleware-axios').AxiosInstanceWrapper} axios - axios middleware instance
 * @param {string} matterCode1 - matter code 1 to get fees for
 * @param {string} matterCode2 - matter code 2 to get fees for
 * @param {string} caseStage - case stage to get fees for
 * @returns {Promise<Array<object>>} - response from api
 * @async
 */
async function getAdditionalFeesFromService(
  axios,
  matterCode1,
  matterCode2,
  caseStage,
  lawCategory,
  suppliedLocation
) {
  if (matterCode1 == null || matterCode2 == null || caseStage == null) {
    throw new Error("Data is missing");
  }

  let locationCode = suppliedLocation

  if (lawCategory === immigrationLaw){
    locationCode = notApplicable
  }

  const requestBody = {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
    locationCode: locationCode,
    caseStage: caseStage,
  };

  const response = await axios.get("/fees/list-available", {
    data: requestBody,
  });

  return response.data.fees;
}

/**
 * Filter so only fees that need to be displayed to user are shown
 * @param {Array<object>} additionalFees - additional fees to filter
 * @returns {Array<object>} - fields to show
 */
export function getDisplayableFees(additionalFees) {
  return additionalFees.filter((fee) => {
    switch (fee.levelCodeType) {
      case feeTypes.optionalUnit:
      case feeTypes.optionalFee:
      case feeTypes.optionalBool:
        return true;
      default:
        return false;
    }
  });
}
