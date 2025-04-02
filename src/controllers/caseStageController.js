import { getNextPage, URL_CaseStage } from "../routes/navigator";
import { isValidCaseStage, getCaseStages } from "../service/caseStageService";
import { getSessionData } from "../utils";
import { pageLoadError, pageSubmitError } from "./errorController";

/**
 * Load the page for the user entering a Case Stage
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showCaseStagePage(req, res) {
  try {
    getSessionData(req);

    res.render("main/caseStage", {
      csrfToken: req.csrfToken(),
      caseStages: getCaseStages(),
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
export function postCaseStagePage(req, res) {
  try {
    const caseStage = req.body.caseStage;

    if (caseStage == null) {
      throw new Error("Case Stage not defined");
    }

    if (!isValidCaseStage(caseStage)) {
      throw new Error("Case Stage is not valid");
    }

    req.session.data.caseStage = caseStage;

    res.redirect(getNextPage(URL_CaseStage));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
