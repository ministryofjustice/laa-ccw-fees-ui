import express from "express";
const router = express.Router();

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

router.get("/law-category", (req, res) => {

  try {
    console.log(req.session?.data)

    res.render("main/lawCategory", { csrfToken: req.csrfToken() });
  } catch (ex) {
    console.error("Error loading page /law-category: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
  }
});

router.post("/law-category", async (req, res) => {
  try {
    const category = req.body.category;
    console.log(req.session?.data)

    //TODO make sure it is in the list...
    if (category == null) {
      throw new Error("Law Category not defined");
    }
    console.log(req.session?.data)

    req.session.data.lawCategory = category;
    console.log(req.session?.data)

    res.redirect("/fee-entry");
  } catch (ex) {
    console.error("Error occurred during POST /law-category: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer.",
    });
  }
});


router.get("/fee-entry", (req, res) => {

  try {
    console.log(req.session?.data)

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

    //TODO validate law category is here also
    const result = req.session?.data?.result;

    if (result == null) {
      throw new Error("Result not defined");
    }

    const lawCategory = req.session?.data?.lawCategory;

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
