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
    getSessionData(req);

    res.render("main/claimStart", {
      csrfToken: req.csrfToken(),
      categories: getLawCategories(),
      today: todayString(),
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

    if (errors.list.length > 0) {
      res.render("main/claimStart", {
        categories: getLawCategories(),
        today: todayString(),
        errors,
        formValues: {
          date,
          category,
        },
      });
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
