import { getUrl } from "../routes/urls";
import {
  getMatterCode2s,
  isValidMatterCode2,
} from "../service/matterCode2Service";
import { getSessionData } from "../utils";
import { pageLoadError, pageSubmitError } from "./errorController";

/**
 * Load the page for the user to enter Matter Code 2
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showMatterCode2Page(req, res) {
  try {
    getSessionData(req);

    res.render("main/matterCode2", {
      csrfToken: req.csrfToken(),
      matterCodes: getMatterCode2s(),
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered Matter Code 2
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function postMatterCode2Page(req, res) {
  try {
    const matterCode2 = req.body.matterCode2;

    if (matterCode2 == null) {
      throw new Error("Matter Code 2 not defined");
    }

    if (!isValidMatterCode2(matterCode2)) {
      throw new Error("Matter Code 2 is not valid");
    }

    req.session.data.matterCode2 = matterCode2;

    res.redirect(getUrl("feeEntry"));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
