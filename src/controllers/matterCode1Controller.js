import { getNextPage, URL_MatterCode1 } from "../routes/navigator";
import { getMatterCode1s } from "../service/matterCode1Service";
import { cleanData, getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { validateMatterCode1 } from "./validations/matterCode1Validator.js";

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

    const validMatterCode1s = await getMatterCode1s(req);

    const errors = validateMatterCode1(validMatterCode1s, matterCode1);

    if (errors.list.length > 0) {
      res.render("main/matterCode", {
        matterCodes: validMatterCode1s,
        id: "matterCode1",
        label: "Matter Code 1",
        errors,
        formValues: {
          matterCode1: matterCode1,
        },
      });
    } else {
      const hasMatterCodeChanged =
        req.session.data?.matterCode1 !== matterCode1;

      if (hasMatterCodeChanged) {
        cleanData(req, URL_MatterCode1);
      }

      req.session.data.matterCode1 = matterCode1;

      res.redirect(getNextPage(URL_MatterCode1, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
