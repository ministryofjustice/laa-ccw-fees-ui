import { getNextPage, URL_AdditionalCosts } from "../routes/navigator";
import {
  feeTypes,
  getAdditionalFees,
  getDisplayableFees,
  isValidFeeEntered,
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
 * @returns {Promise<void>}
 */
export async function showAdditionalCostsPage(req, res) {
  try {
    getSessionData(req);

    if (req.session.data.lawCategory !== immigrationLaw) {
      return res.redirect(getNextPage(URL_AdditionalCosts));
    }

    await getCaseStageForImmigration(req);
    const additionalFees = await getAdditionalFees(req);

    const fields = getDisplayableFees(additionalFees);

    if (fields.length == 0) {
      //Nothing to ask them
      return res.redirect(getNextPage(URL_AdditionalCosts));
    }

    res.render("main/additionalCosts", {
      csrfToken: req.csrfToken(),
      fieldsToShow: fields,
      feeTypes: feeTypes,
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
    const fields = getDisplayableFees(additionalFees);
    let enteredAdditionalCosts = [];

    for (const field of fields) {
      let value = req.body[field.levelCode];

      if (value == null) {
        throw new Error(field.levelCode + " not defined");
      }

      if (field.type === feeTypes.optionalFee) {
        if (value.trim() == "") {
          // Allowed to skip this field if you have no fee
          value = "0";
        } else {
          if (!isValidFeeEntered(value)) {
            throw new Error(
              field.levelCode + " must be a currency value or empty",
            );
          }
        }
      } else {
        if (!isValidUnitEntered(value)) {
          throw new Error(
            field.levelCode + " must be an integer between 0 and 9",
          );
        }
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
