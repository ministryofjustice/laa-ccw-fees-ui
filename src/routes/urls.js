// To make it change urls easier during this early stage of the project
const urls = {
  claimStart: "claim-start",
  feeEntry: "fee-entry",
  result: "result",
};

/**
 * Get URL for a page based on the key
 * @param {string} key - page key
 * @returns {string} url
 */
export function getUrl(key) {
  return urls[key] ? "/" + urls[key] : "";
}
