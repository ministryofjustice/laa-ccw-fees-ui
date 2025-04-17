import { getNextPage, URL_VatIndicator } from "../routes/navigator";
import { getSessionData } from "../service/sessionDataService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { validateVatIndicator } from "./validations/vatIndicatorValidator.js";

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

    const errors = validateVatIndicator(vatIndicator);

    if (errors.list.length > 0) {
      res.render("main/vatIndicator", {
        errors,
        formValues: {
          vatIndicator,
        },
      });
    } else {
      req.session.data.vatIndicator = vatIndicator === "yes" ? true : false;

      res.redirect(getNextPage(URL_VatIndicator, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
