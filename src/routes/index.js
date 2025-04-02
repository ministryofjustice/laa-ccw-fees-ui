import express from "express";
import {
  postClaimStartPage,
  showClaimStartPage,
} from "../controllers/claimStartController";
import {
  postFeeEntryPage,
  showFeeEntryPage,
} from "../controllers/feeEntryController";
import { getUrl } from "./urls";
import {
  postLondonRatePage,
  showLondonRatePage,
} from "../controllers/londonRateController";
import { showResultPage } from "../controllers/resultController";
import { postStartPage, showStartPage } from "../controllers/startController";
import {
  postMatterCode1Page,
  showMatterCode1Page,
} from "../controllers/matterCode1Controller";

export const router = express.Router();

router.get(getUrl("start"), showStartPage);
router.post(getUrl("start"), postStartPage);

router.get(getUrl("claimStart"), showClaimStartPage);
router.post(getUrl("claimStart"), postClaimStartPage);

router.get(getUrl("feeEntry"), showFeeEntryPage);
router.post(getUrl("feeEntry"), postFeeEntryPage);

router.get(getUrl("londonRate"), showLondonRatePage);
router.post(getUrl("londonRate"), postLondonRatePage);

router.get(getUrl("matterCode1"), showMatterCode1Page);
router.post(getUrl("matterCode1"), postMatterCode1Page);

router.get(getUrl("result"), showResultPage);

export default router;
