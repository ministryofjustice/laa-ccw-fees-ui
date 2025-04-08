import { getNextPage, URL_VatIndicator } from "../routes/navigator";
import { getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";

/**
 * Load the page for the user entering VAT Indicator
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showVatIndicatorPage(req, res) {
  try {
    getSessionData(req);

    res.render("main/vatIndicator", {
      csrfToken: req.csrfToken(),
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered VAT Indicator rate
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function postVatIndicatorRate(req, res) {
  try {
    const vatIndicator = req.body.vatIndicator;

    if (vatIndicator == null) {
      throw new Error("VAT Indicator not defined");
    }

    if (vatIndicator !== "yes" && vatIndicator !== "no") {
      throw new Error("VAT Indicator is not valid");
    }

    req.session.data.vatIndicator = vatIndicator === "yes" ? true : false;

    res.redirect(getNextPage(URL_VatIndicator));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
