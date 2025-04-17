import { getNextPage, URL_CaseStage } from "../routes/navigator";
import { getCaseStages } from "../service/caseStageService";
import { getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";
import {
  validateCaseStage,
} from "./validations/caseStageValidator.js";

/**
 * Load the page for the user entering a Case Stage
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function showCaseStagePage(req, res) {
  try {
    getSessionData(req);

    const caseStages = await getCaseStages(req);

    res.render("main/caseStage", {
      csrfToken: req.csrfToken(),
      caseStages: caseStages,
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered Case Stage
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function postCaseStagePage(req, res) {
  try {
    const caseStage = req.body.caseStage;

    const validCaseStages = await getCaseStages(req);

    const errors = validateCaseStage(validCaseStages, caseStage);

    if (errors.list.length > 0) {
      res.render("main/caseStage", {
        caseStages: validCaseStages,
        errors,
        formValues: {
          caseStage,
        },
      });
    } else {
      req.session.data.caseStage = caseStage;

      res.redirect(getNextPage(URL_CaseStage, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
