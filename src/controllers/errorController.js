/**
 * Log error and show error page from loading
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {Error} ex Error thrown
 */
export function pageLoadError(req, res, ex) {
  console.error("Error loading page %s: %s", req.originalUrl, ex.message);

  res.render("main/error", {
    status: "An error occurred",
    error: "An error occurred loading the page.",
  });
}

/**
 * Log error and show error page from submit
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {Error} ex Error thrown
 */
export function pageSubmitError(req, res, ex) {
  console.error(
    "Error occurred during POST %s: %s",
    req.originalUrl,
    ex.message,
  );

  res.render("main/error", {
    status: "An error occurred",
    error: "An error occurred saving the answer.",
  });
}
