/**
 * Ask API for calculation detials
 * @async
 * @param {object} sessionData - data user has entered previously
 * @param {import('middleware-axios').AxiosInstanceWrapper} axios - axios middleware instance
 * @returns {object} - api response
 * @throws {Error} - if api call fails or data missing
 */
export async function getCalculationResult(sessionData, axios) {
  const matterCode1 = sessionData.matterCode1;
  const matterCode2 = sessionData.matterCode2;
  const locationCode = sessionData.londonRate;
  const caseStage = sessionData.caseStage;

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

  const response = await axios.get("/fees/calculate", { data: requestBody });

  const result = response.data;

  return {
    amount: result.amount,
    total: result.total,
    vat: result.vat,
  };
}
