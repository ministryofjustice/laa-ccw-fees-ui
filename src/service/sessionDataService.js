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
 *
 * Cached data:
 *  - validMatterCode1s
 *  - validMatterCode2s
 */
import {
  URL_ClaimStart,
  URL_MatterCode1,
  URL_MatterCode2,
} from "../routes/navigator";

export function cleanData(req, page) {
  //If we have changed data that other values depend on, we need to mop up that old data
  // E.g. matterCode2 depends on matterCode1 so changing matterCode1 invalidates any matterCode2 data
  switch (page) {
    case URL_ClaimStart:
      req.session.data.validMatterCode1s = null;
      req.session.data.validMatterCode2s = null;
      req.session.data.matterCode1 = null;
      req.session.data.matterCode2 = null;
      req.session.data.caseStage = null;
      req.session.data.londonRate = null;
      req.session.data.vatIndicator = null;
      break;
    case URL_MatterCode1:
      req.session.data.validMatterCode2s = null;
      req.session.data.matterCode2 = null;
      req.session.data.caseStage = null;
      req.session.data.londonRate = null;
      req.session.data.vatIndicator = null;
      break;
    case URL_MatterCode2:
      req.session.data.caseStage = null;
      req.session.data.londonRate = null;
      req.session.data.vatIndicator = null;
      break;
  }
}
