import {
  isValidLawCategory,
  getLawCategories,
} from "../service/lawCategoryService";
import { getSessionData } from "../utils";

/**
 * Load the page for the user entering a Law Category
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showClaimStartPage(req, res) {
  try {
    getSessionData(req);

    res.render("main/claimStart", {
      csrfToken: req.csrfToken(),
      categories: getLawCategories(),
    });
  } catch (ex) {
    console.error("Error loading page %s: %s",req.originalUrl, ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
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

    req.session.data.lawCategory = category;

    res.redirect("/fee-entry");
  } catch (ex) {
    console.error("Error occurred during POST %s: %s", req.originalUrl, ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer.",
    });
  }
}
