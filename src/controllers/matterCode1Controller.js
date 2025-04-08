import { getNextPage, URL_MatterCode1 } from "../routes/navigator";
import {
  getMatterCode1s,
  isValidMatterCode1,
} from "../service/matterCode1Service";
import { cleanData, getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";

/**
 * Load the page for the user to enter Matter Code 1
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function showMatterCode1Page(req, res) {
  try {
    getSessionData(req);

    const matterCodes = await getMatterCode1s(req);

    res.render("main/matterCode", {
      csrfToken: req.csrfToken(),
      matterCodes: matterCodes,
      id: "matterCode1",
      label: "Matter Code 1",
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
export async function postMatterCode1Page(req, res) {
  try {
    const matterCode1 = req.body.matterCode1;

    if (matterCode1 == null) {
      throw new Error("Matter Code 1 not defined");
    }

    const validMatterCode1s = await getMatterCode1s(req);

    if (!isValidMatterCode1(validMatterCode1s, matterCode1)) {
      throw new Error("Matter Code 1 is not valid");
    }

    const hasMatterCodeChanged = req.session.data?.matterCode1 != matterCode1;
    if (hasMatterCodeChanged) {
      cleanData(req, URL_MatterCode1);
    }

    req.session.data.matterCode1 = matterCode1;

    res.redirect(getNextPage(URL_MatterCode1));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
