import express from "express";
import {
  postClaimStartPage,
  showClaimStartPage,
} from "../controllers/claimStartController";
import { getSessionData } from "../utils";
import {
  postFeeEntryPage,
  showFeeEntryPage,
} from "../controllers/feeEntryController";
import { getLawCategoryDescription } from "../service/lawCategoryService";
import { getUrl } from "./urls";
import { postLondonRatePage, showLondonRatePage } from "../controllers/londonRateController";

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
  req.session.data = {};
  res.redirect(getUrl("claimStart"));
});

router.get(getUrl("claimStart"), showClaimStartPage);
router.post(getUrl("claimStart"), postClaimStartPage);

router.get(getUrl("feeEntry"), showFeeEntryPage);
router.post(getUrl("feeEntry"), postFeeEntryPage);

router.get(getUrl("londonRate"), showLondonRatePage);
router.post(getUrl("londonRate"), postLondonRatePage);

router.get("/result", (req, res) => {
  try {
    const data = getSessionData(req);
    const result = data?.result;

    if (result == null) {
      throw new Error("Result not defined");
    }

    const lawCategory = data?.lawCategory;
    if (lawCategory == null) {
      throw new Error("Law category not defined");
    }

    res.render("main/result", {
      number: result,
      category: getLawCategoryDescription(lawCategory),
    });
  } catch (ex) {
    console.error("Error occurred while loading /result: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred loading the page.",
    });
  }
});

export default router;
