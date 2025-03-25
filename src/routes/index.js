import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  //TODO start page should probably clear out any left over session data

  try {
    res.render("main/index", { csrfToken: req.csrfToken() });
  } catch (ex) {
    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred.",
    });
  }
});

router.post("/", async (req, res) => {

  try {
    const fee = req.body.fee;

    if (fee == null || isNaN(fee)){
      throw new Error("Fee not defined");
    }

    const response = await req.axiosMiddleware.post("/fees/" + fee);
    const number = response.data

    // Save this so it can be displayed on the result page
    req.session.result = number;

    res.redirect("/result")
  } catch (ex) {

    console.error("Error occurred during POST /: {}", ex.message)

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer.",
    });
  }
});

router.get("/result", (req, res) => {
  console.log("followed redirect")

  res.render("main/result", {number: req.session.result })
});

export default router;
