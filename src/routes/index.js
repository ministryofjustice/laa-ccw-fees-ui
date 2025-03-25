import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("main/index", { csrfToken: req.csrfToken() });
  } catch (ex) {
    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred :(.",
    });
  }
});

router.post("/", async (req, res) => {

  try {
    console.log('in post')
    const response = await req.axiosMiddleware.post("/fees/" + req.body.fee);
    const number = response.data
    console.log(number)
    req.session.result = number;
    console.log("before redirect")
    res.redirect("/result")
  } catch {
    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred posting the answer :(.",
    });
  }
});

router.get("/result", (req, res) => {
  console.log("followed redirect")

  res.render("main/result", {number: req.session.result })
});

export default router;
