import { getNextPage, URL_ClaimStart } from "../routes/navigator";
import { getLawCategories } from "../service/lawCategoryService";
import { cleanData, getSessionData } from "../service/sessionDataService";
import { todayString } from "../utils/dateTimeUtils";
import { pageLoadError, pageSubmitError } from "./errorController";
import { validateClaimStart } from "./validations/claimStartValidator.js";

/**
 * Load the page for the user entering a Law Category & Start Date
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showClaimStartPage(req, res) {
  try {
    const sessionData = getSessionData(req);

    let errors = {};
    let formValues = {};

    if (req.session.formError) {
      errors = req.session.formError;
      formValues = req.session.formValues;

      delete req.session.formError;
      delete req.session.formValues;
    } else {
      if (sessionData.startDate) {
        formValues.date = sessionData.startDate;
      }
      if (sessionData.lawCategory) {
        formValues.category = sessionData.lawCategory;
      }
    }

    res.render("main/claimStart", {
      csrfToken: req.csrfToken(),
      categories: getLawCategories(),
      today: todayString(),
      errors: errors,
      formValues: formValues,
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered Law Category
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function postClaimStartPage(req, res) {
  try {
    const date = req.body.date;
    const category = req.body.category;

    const errors = validateClaimStart(date, category);

    if (errors.list?.length > 0) {
      req.session.formError = errors;
      req.session.formValues = {
        date: date,
        category: category,
      };

      res.redirect(URL_ClaimStart);
    } else {
      const hasCategoryChanged = req.session.data?.lawCategory !== category;
      if (hasCategoryChanged) {
        cleanData(req, URL_ClaimStart);
      }

      req.session.data.startDate = date;
      req.session.data.lawCategory = category;

      res.redirect(getNextPage(URL_ClaimStart, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
