// To make it change urls easier during this early stage of the project
const urls = {
  start: "/",
  claimStart: "claim-start",
  feeEntry: "fee-entry",
  result: "result",
  londonRate: "london-rate",
  matterCode1: "matter-code-1",
};

/**
 * Get URL for a page based on the key
 * @param {string} key - page key
 * @returns {string} url
 */
export function getUrl(key) {
  return urls[key] ? "/" + urls[key] : "";
}
