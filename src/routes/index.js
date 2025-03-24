import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {

  try {
  
  const response = await req.axiosMiddleware.get("/");

  res.render("main/index", { response } );
  } catch {
    res.render('main/error', {status: "An error occurred", error: "An error occurred :(."});
  }
});

export default router;
