import { getUrl } from "../routes/urls";
import { getSessionData } from "../utils";

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
    console.error("Error loading page /fee-entry: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
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

    res.redirect(getUrl("result"));
  } catch (ex) {
    console.error("Error occurred during POST /fee-entry: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer.",
    });
  }
}
