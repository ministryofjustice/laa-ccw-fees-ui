/**
 * Gets the valid matter code 1s
 * @param {import('express').Request} req Express request object
 * @returns {Promise<Array[]>} - the valid matter codes
 * @async
 */
export async function getMatterCode1s(req) {
  if (req.session.data.validMatterCode1s == null) {
    req.session.data.validMatterCode1s = await getMatterCode1sFromService(
      req.axiosMiddleware,
      req.session.data.lawCategory,
    );
  }

  return req.session.data.validMatterCode1s;
}

/**
 * Check an entered matter code 1 is valid
 * @param {Array[Object]} validMatterCode1s - list of valid matter codes returned by the getMatterCode1s routine
 * @param {string} enteredMatterCode - matter code 1 user selected
 * @returns {boolean} - true if matter code 1 is valid, false otherwise
 */
export function isValidMatterCode1(validMatterCode1s, enteredMatterCode) {
  return validMatterCode1s.some(
    (matterCode) => matterCode.matterCode === enteredMatterCode,
  );
}

/**
 * Get the matter code 1s from the backend service
 * @param {import('middleware-axios').AxiosInstanceWrapper} axios - axios middleware instance
 * @param {string} lawCategory - law category to get details for
 * @returns {Promise<Array<object>>} - response from api
 * @async
 */
async function getMatterCode1sFromService(axios, lawCategory) {
  const response = await axios.get("/matter-codes/" + lawCategory);

  return response.data.matterCodes;
}
