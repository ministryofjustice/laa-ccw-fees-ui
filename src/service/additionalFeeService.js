import { notApplicable } from "./londonRateService";

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
) {
  if (matterCode1 == null || matterCode2 == null || caseStage == null) {
    throw new Error("Data is missing");
  }

  const requestBody = {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
    locationCode: notApplicable,
    caseStage: caseStage,
  };

  const response = await axios.get("/fees/list-available", {
    data: requestBody,
  });

  return response.data.fees;
}
