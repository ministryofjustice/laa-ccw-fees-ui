//TODO will be api call in future

const matterCode2s = [
  {
    id: "FPET",
    description: "Client is the petitioner in the Divorce/Judical Separation/Nullity/Dissolution of Civil Partnership",
  },
  {
    id: "FRES",
    description: "Client is the respondent in the Divorce/Judical Separation/Nullity/Dissolution of Civil Partnership",
  },
];

/**
 * Gets the valid matter code 2s
 * @returns {Array[]} - the valid matter codes
 */
export function getMatterCode2s() {
  return matterCode2s;
}

/**
 * Check an entered matter code 2 is valid
 * @param {string} enteredMatterCode - matter code 2 user selected
 * @returns {boolean} - true if matter code 2 is valid, false otherwise
 */
export function isValidMatterCode2(enteredMatterCode) {
  return matterCode2s.some((matterCode) => matterCode.id === enteredMatterCode);
}
