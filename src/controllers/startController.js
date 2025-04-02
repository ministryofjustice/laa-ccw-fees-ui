import { getNextPage, URL_Start } from "../routes/navigator";

/**
 * Load the start page
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showStartPage(req, res) {
  try {
    res.render("main/index", { csrfToken: req.csrfToken() });
  } catch (ex) {
    console.error("Error loading page /: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
  }
}

/**
 * Initialise data and start the journey
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function postStartPage(req, res) {
  // Remove any old data. They have restarted
  req.session.data = {};
  res.redirect(getNextPage(URL_Start));
}
