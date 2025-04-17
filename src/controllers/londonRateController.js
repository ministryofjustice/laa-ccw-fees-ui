import { getNextPage, URL_LondonRate } from "../routes/navigator";
import { getLondonRates } from "../service/londonRateService";
import { getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { validateLondonRate } from "./validations/londonRateValidator.js";

/**
 * Load the page for the user entering London / Non-London Rate
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showLondonRatePage(req, res) {
  try {
    getSessionData(req);

    res.render("main/londonRate", {
      csrfToken: req.csrfToken(),
      rates: getLondonRates(),
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

    if (errors.list.length > 0) {
      res.render("main/londonRate", {
        rates: getLondonRates(),
        errors,
        formValues: {
          londonRate,
        },
      });
    } else {
      req.session.data.londonRate = londonRate;

      res.redirect(getNextPage(URL_LondonRate, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
