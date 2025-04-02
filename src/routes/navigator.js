export const URL_Start = "/";
export const URL_ClaimStart = "/claim-start";
export const URL_FeeEntry = "/fee-entry";
export const URL_Result = "/result";
export const URL_LondonRate = "/london-rate";
export const URL_MatterCode1 = "/matter-code-1";
export const URL_MatterCode2 = "/matter-code-2";
export const URL_NavigationError = "/error";

export function getNextPage(currentPage) {
  switch (currentPage) {
    case URL_Start:
      return URL_ClaimStart;
    case URL_ClaimStart:
      return URL_LondonRate;
    case URL_LondonRate:
      return URL_MatterCode1;
    case URL_MatterCode1:
      return URL_MatterCode2;
    case URL_MatterCode2:
      return URL_FeeEntry;
    case URL_FeeEntry:
      return URL_Result;
    case URL_Result:
      throw new NavigationError("Nowhere to navigate to from Result page");
    default:
      throw new NavigationError("Unexpected page");
  }
}

/**
 * Error wrapper for navigator issues
 */
export class NavigationError extends Error {
  /**
   * Create NavigationError
   * @param {string} message - reason navigation failed
   */
  constructor(message) {
    super("Navigation error: " + message);
  }
}
