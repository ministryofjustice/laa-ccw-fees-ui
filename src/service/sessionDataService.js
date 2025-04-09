/**
 * Session data contains
 * Entered data:
 *  - startDate
 *  - lawCategory
 *  - matterCode1
 *  - matterCode2
 *  - caseStage
 *  - londonRate
 *  - vatIndicator
 *  - additionalCosts
 *
 * Cached data:
 *  - validMatterCode1s
 *  - validMatterCode2s
 *  - validCaseStages
 *  - validAdditionalFees
 */
import {
  URL_ClaimStart,
  URL_MatterCode1,
  URL_MatterCode2,
} from "../routes/navigator";

/**
 * Clean up the session data for later pages
 * @param {import('express').Request} req Express request object
 * @param {string} page - page we are on and so determines what data needs cleaning
 */
export function cleanData(req, page) {
  // If we have changed data that other values depend on, we need to mop up that old data
  // E.g. matterCode2 depends on matterCode1 so changing matterCode1 invalidates any matterCode2 data
  switch (page) {
    case URL_ClaimStart:
      req.session.data.validMatterCode1s = null;
      req.session.data.validMatterCode2s = null;
      req.session.data.validCaseStages = null;
      req.session.data.matterCode1 = null;
      req.session.data.matterCode2 = null;
      req.session.data.caseStage = null;
      req.session.data.londonRate = null;
      req.session.data.vatIndicator = null;
      req.session.data.additionalCosts = null;
      req.session.data.validAdditionalFees = null;
      break;
    case URL_MatterCode1:
      req.session.data.validMatterCode2s = null;
      req.session.data.validCaseStages = null;
      req.session.data.matterCode2 = null;
      req.session.data.caseStage = null;
      req.session.data.londonRate = null;
      req.session.data.vatIndicator = null;
      req.session.data.additionalCosts = null;
      req.session.data.validAdditionalFees = null;

      break;
    case URL_MatterCode2:
      req.session.data.validCaseStages = null;
      req.session.data.caseStage = null;
      req.session.data.londonRate = null;
      req.session.data.vatIndicator = null;
      req.session.data.additionalCosts = null;
      req.session.data.validAdditionalFees = null;

      break;
  }
}
/**
 * Check if session has the data object setup and throw error if not
 * Lack of session.data suggests they've been skipping pages, there's been an error in the server, etc
 * @param {import('express').Request} req - Express request object
 * @returns {object} session data if exists
 */
export function getSessionData(req) {
  const data = req.session?.data;
  if (data == null) {
    //TODO custom error??
    throw new Error("No session data found");
  }

  return data;
}
