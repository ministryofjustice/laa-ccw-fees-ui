import express from "express";
import {
  postClaimStartPage,
  showClaimStartPage,
} from "../controllers/claimStartController";
import {
  postFeeEntryPage,
  showFeeEntryPage,
} from "../controllers/feeEntryController";
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
import { URL_ClaimStart, URL_FeeEntry, URL_LondonRate, URL_MatterCode1, URL_MatterCode2, URL_Result, URL_Start } from "./navigator";
import { postMatterCode2Page, showMatterCode2Page } from "../controllers/matterCode2Controller";

export const router = express.Router();

router.get(URL_Start, showStartPage);
router.post(URL_Start, postStartPage);

router.get(URL_ClaimStart, showClaimStartPage);
router.post(URL_ClaimStart, postClaimStartPage);

router.get(URL_FeeEntry, showFeeEntryPage);
router.post(URL_FeeEntry, postFeeEntryPage);

router.get(URL_LondonRate, showLondonRatePage);
router.post(URL_LondonRate, postLondonRatePage);

router.get(URL_MatterCode1, showMatterCode1Page);
router.post(URL_MatterCode1, postMatterCode1Page);

router.get(URL_MatterCode2, showMatterCode2Page);
router.post(URL_MatterCode2, postMatterCode2Page);

router.get(URL_Result, showResultPage);

export default router;
