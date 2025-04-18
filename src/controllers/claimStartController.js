import { getNextPage, URL_ClaimStart } from "../routes/navigator";
import {
  isValidLawCategory,
  getLawCategories,
} from "../service/lawCategoryService";
import { cleanData, getSessionData } from "../service/sessionDataService";
import { validateEnteredDate, todayString } from "../utils/dateTimeUtils";
import { pageLoadError, pageSubmitError } from "./errorController";

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
    const category = req.body.category;

    if (category == null) {
      throw new Error("Law Category not defined");
    }

    if (!isValidLawCategory(category)) {
      throw new Error("Law Category is not valid");
    }

    const date = req.body.date;
    if (date == null) {
      throw new Error("Date case was opened is not defined");
    }

    if (!validateEnteredDate(date)) {
      throw new Error("Date is not valid");
    }

    const hasCategoryChanged = req.session.data?.lawCategory != category;
    if (hasCategoryChanged) {
      cleanData(req, URL_ClaimStart);
    }

    req.session.data.startDate = date;
    req.session.data.lawCategory = category;

    res.redirect(getNextPage(URL_ClaimStart, req.session.data));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
