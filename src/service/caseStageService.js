/**
 * Gets the case stages
 * @param {import('express').Request} req Express request object
 * @returns {Promise<Array[]>} - the valid case stage
 * @async
 */
export async function getCaseStages(req) {
  if (req.session.data.validCaseStages == null) {
    req.session.data.validCaseStages = await getCaseStagesFromService(
      req.axiosMiddleware,
      req.session.data.matterCode1,
      req.session.data.matterCode2,
    );
  }

  return req.session.data.validCaseStages;
}

/**
 * Check an entered case stage is valid
 * @param {Array[Object]} validCaseStages - list of valid caseStages returned by the getCaseStages routine
 * @param {string} enterCaseStage - case stage user selected
 * @returns {boolean} - true if case stage is valid, false otherwise
 */
export function isValidCaseStage(validCaseStages, enterCaseStage) {
  return validCaseStages.some(
    (caseStage) => caseStage.caseStage === enterCaseStage,
  );
}
/**
 * Get the case stages from the backend service
 * @param {import('middleware-axios').AxiosInstanceWrapper} axios - axios middleware instance
 * @param {string} matterCode1 - matter code 1 to get stages for
 * @param {string} matterCode2 - matter code 2 to get stages for
 * @returns {Promise<Array<object>>} - response from api
 * @async
 */
async function getCaseStagesFromService(axios, matterCode1, matterCode2) {
  const requestBody = {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
  };

  const response = await axios.get("/case-stages", {
    data: requestBody,
  });

  return response.data.caseStages;
}
