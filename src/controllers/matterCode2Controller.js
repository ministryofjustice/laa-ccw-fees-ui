import { getNextPage, URL_MatterCode2 } from "../routes/navigator";
import { getMatterCode2s } from "../service/matterCode2Service";
import { pageLoadError, pageSubmitError } from "./errorController";
import { cleanData, validateSession } from "../service/sessionDataService";
import { validateMatterCode2 } from "./validations/matterCode2Validator.js";

/**
 * Load the page for the user to enter Matter Code 2
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function showMatterCode2Page(req, res) {
  try {
    validateSession(req);

    let errors = {};
    let formValues = {};
    if (req.session.formError) {
      errors = req.session.formError;
      formValues = req.session.formValues;

      delete req.session.formError;
      delete req.session.formValues;
    } else {
      if (req.session.data.matterCode2) {
        formValues.matterCode2 = req.session.data.matterCode2;
      }
    }

    const matterCodes = await getMatterCode2s(req);

    res.render("main/matterCode", {
      csrfToken: req.csrfToken(),
      matterCodes: matterCodes,
      id: "matterCode2",
      label: "Matter Code 2",
      errors: errors,
      formValues: formValues,
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
export async function postMatterCode2Page(req, res) {
  try {
    const matterCode2 = req.body.matterCode2;

    const validMatterCode2s = await getMatterCode2s(req);

    const errors = validateMatterCode2(validMatterCode2s, matterCode2);

    if (errors.list?.length > 0) {
      req.session.formError = errors;
      req.session.formValues = {
        matterCode2: matterCode2,
      };

      res.redirect(URL_MatterCode2);
    } else {
      const hasMatterCodeChanged = req.session.data?.matterCode2 != matterCode2;
      if (hasMatterCodeChanged) {
        cleanData(req, URL_MatterCode2);
      }

      req.session.data.matterCode2 = matterCode2;

      res.redirect(getNextPage(URL_MatterCode2, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
