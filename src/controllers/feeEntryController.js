import { getNextPage, URL_FeeEntry } from "../routes/navigator";
import { getSessionData } from "../utils";
import { pageLoadError, pageSubmitError } from "./errorController";

/**
 * Load the page for the user entering a Fee
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showFeeEntryPage(req, res) {
  try {
    getSessionData(req);
    res.render("main/feeEntry", { csrfToken: req.csrfToken() });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered Fee
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function postFeeEntryPage(req, res) {
  try {
    console.log("FEE " + req.body.fee);
    const fee = req.body.fee;
    if (fee == null || isNaN(fee)) {
      throw new Error("Fee not defined");
    }

    const response = await req.axiosMiddleware.post("/fees/" + fee);

    const number = response.data;

    // Save this so it can be displayed on the result page
    req.session.data.result = number;

    res.redirect(getNextPage(URL_FeeEntry));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
