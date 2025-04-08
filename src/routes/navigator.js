import { familyLaw } from "../service/lawCategoryService";

export const URL_Start = "/";
export const URL_ClaimStart = "/claim-start";
export const URL_Result = "/result";
export const URL_LondonRate = "/london-rate";
export const URL_MatterCode1 = "/matter-code-1";
export const URL_MatterCode2 = "/matter-code-2";
export const URL_ErrorPage = "/error";
export const URL_CaseStage = "/case-stage";
export const URL_VatIndicator = "/vat-indicator";
export const URL_AdditionalCosts = "/additional-costs";

/**
 * Find out where we should navigate to next.
 * @param {string} currentPage - what page is it on. Should be one of the above constants.
 * @param {object} sessionData - current session data
 * @returns {string} - next page. Should be one of the above constants.
 * @throws {NavigationError} - if can't figure out where to go next
 */
export function getNextPage(currentPage, sessionData) {
  switch (currentPage) {
    case URL_Start:
      return URL_ClaimStart;
    case URL_ClaimStart:
      return URL_MatterCode1;
    case URL_LondonRate:
      return URL_VatIndicator;
    case URL_MatterCode1:
      return URL_MatterCode2;
    case URL_MatterCode2:
      if (sessionData.lawCategory === familyLaw) {
        return URL_CaseStage;
      } else {
        return URL_AdditionalCosts;
      }
    case URL_CaseStage:
      return URL_LondonRate;
    case URL_AdditionalCosts:
      return URL_VatIndicator;
    case URL_VatIndicator:
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
