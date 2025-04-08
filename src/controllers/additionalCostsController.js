import { getNextPage, URL_AdditionalCosts } from "../routes/navigator";
import {
  feeType_OptionalUnit,
  getAdditionalFees,
  isValidUnitEntered,
} from "../service/additionalFeeService";
import { immigrationLaw } from "../service/lawCategoryService";
import { getCaseStageForImmigration } from "../service/caseStageService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { getSessionData } from "../service/sessionDataService";

/**
 * Load the page for the user to enter any Additional Costs
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @returns {void}
 */
export async function showAdditionalCostsPage(req, res) {
  try {
    getSessionData(req);

    if (req.session.data.lawCategory !== immigrationLaw) {
      return res.redirect(getNextPage(URL_AdditionalCosts));
    }

    await getCaseStageForImmigration(req);
    const additionalFees = await getAdditionalFees(req);

    const fields = getOptionalUnitFees(additionalFees);

    if (fields.length == 0) {
      //Nothing to ask them
      return res.redirect(getNextPage(URL_AdditionalCosts));
    }

    res.render("main/additionalCosts", {
      csrfToken: req.csrfToken(),
      fieldsToShow: fields,
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Process the user's entered additional costs
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export async function postAdditionalCostsPage(req, res) {
  try {
    const additionalFees = await getAdditionalFees(req);
    const fields = getOptionalUnitFees(additionalFees);
    let enteredAdditionalCosts = [];

    for (const field of fields) {
      const value = req.body[field.levelCode];

      if (value == null) {
        throw new Error(field.levelCode + " not defined");
      }

      if (!isValidUnitEntered(value)) {
        throw new Error(
          field.levelCode + " must be an integer between 0 and 9",
        );
      }

      enteredAdditionalCosts.push({
        levelCode: field.levelCode,
        value: value,
      });
    }

    req.session.data.additionalCosts = enteredAdditionalCosts;

    res.redirect(getNextPage(URL_AdditionalCosts, req.session.data));
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}

/**
 * Filter out the OptionalUnit fields
 * @param {Array<object>} additionalFees - additional fees to filter
 * @returns {Array<object>} - fields with OptionalUnit
 */
function getOptionalUnitFees(additionalFees) {
  return additionalFees.filter((fee) => fee.type === feeType_OptionalUnit);
}
