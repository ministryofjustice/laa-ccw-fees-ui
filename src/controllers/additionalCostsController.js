import { getNextPage, URL_AdditionalCosts } from "../routes/navigator";
import {
  feeTypes,
  getFeeDetails,
  getDisplayableFees,
} from "../service/feeDetailsService";
import { immigrationLaw } from "../service/lawCategoryService";
import { getCaseStageForImmigration } from "../service/caseStageService";
import { pageLoadError, pageSubmitError } from "./errorController";
import { getSessionData } from "../service/sessionDataService";
import { validateAndReturnAdditionalCostValue } from "./validations/additionalCostValidator";

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
    const feeDetails = await getFeeDetails(req);

    const fields = getDisplayableFees(feeDetails);

    if (fields.length === 0) {
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
    const feeDetails = await getFeeDetails(req);
    const fields = getDisplayableFees(feeDetails);
    let enteredAdditionalCosts = [];
    const errors = { list: [], messages: {} };
    const formValues = {};
    for (const field of fields) {
      const { error, value } = validateAndReturnAdditionalCostValue(
        req.body[field.levelCode],
        field,
      );

      if (error) {
        const text = `'${field.formQuestion || field.description}' ${error}`;
        errors.list.push({ href: `#${field.levelCode}`, text });
        errors.messages[field.levelCode] = { text };
      } else {
        enteredAdditionalCosts.push({
          levelCode: field.levelCode,
          value: value,
        });
      }
      formValues[field.levelCode] = value;
    }

    if (errors.list.length > 0) {
      res.render("main/additionalCosts", {
        fieldsToShow: fields,
        feeTypes: feeTypes,
        errors,
        formValues,
      });
    } else {
      req.session.data.additionalCosts = enteredAdditionalCosts;

      res.redirect(getNextPage(URL_AdditionalCosts, req.session.data));
    }
  } catch (ex) {
    pageSubmitError(req, res, ex);
  }
}
