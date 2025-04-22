import { getNextPage, URL_LondonRate } from "../routes/navigator";
import { getLondonRates } from "../service/londonRateService";
import { validateSession } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { validateLondonRate } from "./validations/londonRateValidator.js";

/**
 * Load the page for the user entering London / Non-London Rate
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showLondonRatePage(req, res) {
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
      if (req.session.data.londonRate) {
        formValues.londonRate = req.session.data.londonRate;
      }
    }

    res.render("main/londonRate", {
      csrfToken: req.csrfToken(),
      rates: getLondonRates(),
      errors: errors,
      formValues: formValues,
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered London Rate
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function postLondonRatePage(req, res) {
  try {
    const londonRate = req.body.londonRate;

    const errors = validateLondonRate(londonRate);

    if (errors.list?.length > 0) {
      req.session.formError = errors;
      req.session.formValues = {
        londonRate: londonRate,
      };

      res.redirect(URL_LondonRate);
    } else {
      req.session.data.londonRate = londonRate;

      res.redirect(getNextPage(URL_LondonRate, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
