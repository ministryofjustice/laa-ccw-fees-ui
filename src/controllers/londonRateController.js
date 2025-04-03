import { getNextPage, URL_LondonRate } from "../routes/navigator";
import {
  getLondonRates,
  isValidLondonRate,
} from "../service/londonRateService";
import { getSessionData } from "../utils";
import { pageLoadError, pageSubmitError } from "./errorController";

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

    if (londonRate == null) {
      throw new Error("London Rate not defined");
    }

    if (!isValidLondonRate(londonRate)) {
      throw new Error("London Rate is not valid");
    }

    req.session.data.londonRate = londonRate;

    res.redirect(getNextPage(URL_LondonRate));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
