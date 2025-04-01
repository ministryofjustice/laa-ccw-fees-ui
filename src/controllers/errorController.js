
export function pageLoadError(req, res, ex) {
    console.error("Error loading page %s: %s", req.originalUrl, ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred loading the page.",
    });
}

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