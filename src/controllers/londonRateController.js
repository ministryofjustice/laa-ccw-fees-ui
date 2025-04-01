import { getUrl } from '../routes/urls';
import { getLondonRates, isValidLondonRate } from '../service/londonRateService';
import { getSessionData } from '../utils';

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
      rates: getLondonRates()
        });
  } catch (ex) {
    //TODO ??
    console.error("Error loading page %s: %s", req.originalUrl, ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
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

    res.redirect(getUrl("feeEntry"));
  } catch (ex) {
    console.error(
      "Error occurred during POST %s: %s",
      req.originalUrl,
      ex.message,
    );

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer.",
    });
  }
}
