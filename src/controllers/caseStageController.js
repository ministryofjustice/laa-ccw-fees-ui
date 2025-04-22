import { getNextPage, URL_CaseStage } from "../routes/navigator";
import { getCaseStages } from "../service/caseStageService";
import { getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { validateCaseStage } from "./validations/caseStageValidator.js";

/**
 * Load the page for the user entering a Case Stage
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function showCaseStagePage(req, res) {
  try {
    getSessionData(req);

    let errors = {};
    let formValues = {};
    if (req.session.formError) {
      errors = req.session.formError;
      formValues = req.session.formValues;

      delete req.session.formError;
      delete req.session.formValues;
    } else {
      if (req.session.data.caseStage) {
        formValues.caseStage = req.session.data.caseStage;
      }
    }

    const caseStages = await getCaseStages(req);

    res.render("main/caseStage", {
      csrfToken: req.csrfToken(),
      caseStages: caseStages,
      errors: errors,
      formValues: formValues,
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

    if (errors.list?.length > 0) {
      req.session.formError = errors;
      req.session.formValues = {
        caseStage: caseStage,
      };

      res.redirect(URL_CaseStage);
    } else {
      req.session.data.caseStage = caseStage;

      res.redirect(getNextPage(URL_CaseStage, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
