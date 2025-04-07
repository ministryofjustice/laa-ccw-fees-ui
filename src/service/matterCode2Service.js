/**
 * Gets the valid matter code 2s
 * @param {import('express').Request} req Express request object
 * @returns {Promise<Array[]>} - the valid matter codes
 * @async
 */
export async function getMatterCode2s(req) {
  if (req.session.data.validMatterCode2s == null) {
    req.session.data.validMatterCode2s = await getMatterCode2sFromService(
      req.axiosMiddleware,
      req.session.data.matterCode1,
    );
  }

  return req.session.data.validMatterCode2s;
}

/**
 * Check an entered matter code 2 is valid
 * @param {Array[Object]} validMatterCode2s - list of valid matter codes returned by the getMatterCode2s routine
 * @param {string} enteredMatterCode - matter code 2 user selected
 * @returns {boolean} - true if matter code 2 is valid, false otherwise
 */
export function isValidMatterCode2(validMatterCode2s, enteredMatterCode) {
  return validMatterCode2s.some(
    (matterCode) => matterCode.matterCode === enteredMatterCode,
  );
}

/**
 * Get the matter code 2s from the backend service
 * @param {import('middleware-axios').AxiosInstanceWrapper} axios - axios middleware instance
 * @param {string} matterCode1 - matter code 1 to get matter code 2s for
 * @returns {Promise<Array<object>>} - response from api
 * @async
 */
async function getMatterCode2sFromService(axios, matterCode1) {
  const response = await axios.get(
    "/matter-codes/" + matterCode1 + "/matter-code-2",
  );

  return response.data.matterCodes;
}
