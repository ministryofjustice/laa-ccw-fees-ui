import { familyLaw, immigrationLaw } from "./lawCategoryService";

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
  let locationCode = sessionData.londonRate;
  let caseStage = sessionData.caseStage;
  const lawCategory = sessionData.lawCategory;

  switch (lawCategory) {
    case familyLaw:
      if (
        matterCode1 == null ||
        matterCode2 == null ||
        locationCode == null ||
        caseStage == null
      ) {
        throw new Error("Data is missing");
      }
      break;
    case immigrationLaw:
      if (matterCode1 == null || matterCode2 == null) {
        throw new Error("Data is missing");
      }

      locationCode = "NA";
      caseStage = "_IMM01"; //TODO get this automatically from backend
      break;
    default:
      throw new Error("Unsupported law category");
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
