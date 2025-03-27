import express from "express";
import { postLawCategoryPage, showLawCategoryPage } from "../controllers/lawCategoryController";
import { getSessionData } from "../utils";
export const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.render("main/index", { csrfToken: req.csrfToken() });
  } catch (ex) {
    console.error("Error loading page /: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
  }
});

router.post("/", (req, res) => {
  // Remove any old data. They have restarted
  req.session.data = {}
  res.redirect("/law-category");
});

router.get("/law-category", showLawCategoryPage);

router.post("/law-category", postLawCategoryPage);

router.get("/fee-entry", (req, res) => {

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
});

router.post("/fee-entry", async (req, res) => {
  try {
    const fee = req.body.fee;

    if (fee == null || isNaN(fee)) {
      throw new Error("Fee not defined");
    }

    const response = await req.axiosMiddleware.post("/fees/" + fee);
    const number = response.data;
    console.log(req.session?.data)

    // Save this so it can be displayed on the result page
    req.session.data.result = number;
    console.log(req.session?.data)

    res.redirect("/result");
  } catch (ex) {
    console.error("Error occurred during POST /fee-entry: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer.",
    });
  }
});

router.get("/result", (req, res) => {
  try {

    const data = getSessionData(req);
    const result = data?.result;

    if (result == null) {
      throw new Error("Result not defined");
    }

    const lawCategory = data?.lawCategory
    if (lawCategory == null) {
      throw new Error("Law category not defined");
    }

    res.render("main/result", { number: result, category: lawCategory });
  } catch (ex) {
    console.error("Error occurred while loading /result: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred loading the page.",
    });
  }
});

export default router;
