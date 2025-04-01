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
import {
  postLondonRatePage,
  showLondonRatePage,
} from "../controllers/londonRateController";
import { showResultPage } from "../controllers/resultController";
import { postStartPage, showStartPage } from "../controllers/startController";

export const router = express.Router();

router.get(getUrl("start"), showStartPage);
router.post(getUrl("start"), postStartPage);

router.get(getUrl("claimStart"), showClaimStartPage);
router.post(getUrl("claimStart"), postClaimStartPage);

router.get(getUrl("feeEntry"), showFeeEntryPage);
router.post(getUrl("feeEntry"), postFeeEntryPage);

router.get(getUrl("londonRate"), showLondonRatePage);
router.post(getUrl("londonRate"), postLondonRatePage);

router.get(getUrl("result"), showResultPage);

export default router;
