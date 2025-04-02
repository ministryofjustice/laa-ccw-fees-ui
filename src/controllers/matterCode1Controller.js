import { getUrl } from "../routes/urls";
import {
  getMatterCode1s,
  isValidMatterCode1,
} from "../service/matterCode1Service";
import { getSessionData } from "../utils";
import { pageLoadError, pageSubmitError } from "./errorController";

/**
 * Load the page for the user to enter Matter Code 1
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showMatterCode1Page(req, res) {
  try {
    getSessionData(req);

    res.render("main/matterCode", {
      csrfToken: req.csrfToken(),
      matterCodes: getMatterCode1s(),
      id: "matterCode1",
      label: "Matter Code 1"
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered Matter Code 1
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function postMatterCode1Page(req, res) {
  try {
    const matterCode1 = req.body.matterCode1;

    if (matterCode1 == null) {
      throw new Error("Matter Code 1 not defined");
    }

    if (!isValidMatterCode1(matterCode1)) {
      throw new Error("Matter Code 1 is not valid");
    }

    req.session.data.matterCode1 = matterCode1;

    res.redirect(getUrl("feeEntry"));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
