import express from "express";
import {
  postClaimStartPage,
  showClaimStartPage,
} from "../controllers/claimStartController";
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
import {
  URL_AdditionalCosts,
  URL_CaseStage,
  URL_ClaimStart,
  URL_ErrorPage,
  URL_LondonRate,
  URL_MatterCode1,
  URL_MatterCode2,
  URL_Result,
  URL_Start,
  URL_VatIndicator,
} from "./navigator";
import {
  postMatterCode2Page,
  showMatterCode2Page,
} from "../controllers/matterCode2Controller";
import {
  showCaseStagePage,
  postCaseStagePage,
} from "../controllers/caseStageController";
import {
  postVatIndicatorRate,
  showVatIndicatorPage,
} from "../controllers/vatIndicatorController";
import { showGenericErrorPage } from "../controllers/errorController";
import {
  postAdditionalCostsPage,
  showAdditionalCostsPage,
} from "../controllers/additionalCostsController";

export const router = express.Router();

router.get(URL_Start, showStartPage);
router.post(URL_Start, postStartPage);

router.get(URL_ClaimStart, showClaimStartPage);
router.post(URL_ClaimStart, postClaimStartPage);

router.get(URL_LondonRate, showLondonRatePage);
router.post(URL_LondonRate, postLondonRatePage);

router.get(URL_MatterCode1, showMatterCode1Page);
router.post(URL_MatterCode1, postMatterCode1Page);

router.get(URL_MatterCode2, showMatterCode2Page);
router.post(URL_MatterCode2, postMatterCode2Page);

router.get(URL_CaseStage, showCaseStagePage);
router.post(URL_CaseStage, postCaseStagePage);

router.get(URL_VatIndicator, showVatIndicatorPage);
router.post(URL_VatIndicator, postVatIndicatorRate);

router.get(URL_AdditionalCosts, showAdditionalCostsPage);
router.post(URL_AdditionalCosts, postAdditionalCostsPage);

router.get(URL_Result, showResultPage);

router.get(URL_ErrorPage, showGenericErrorPage);

export default router;
