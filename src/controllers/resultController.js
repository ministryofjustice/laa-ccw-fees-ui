import { getSessionData } from "../service/sessionDataService";
import { getCalculationResult } from "../service/feeCalculatorService";
import { pageLoadError } from "./errorController";
import { familyLaw, immigrationLaw } from "../service/lawCategoryService";
import { getFeeDetails } from "../service/feeDetailsService";

/**
 * Load the page to display the result
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @async
 */
export async function showResultPage(req, res) {
  try {
    const data = getSessionData(req);
    const calculatorResult = await getCalculationResult(
      data,
      req.axiosMiddleware,
    );

    const isVat = data.vatIndicator != null ? data.vatIndicator : true;

    const total = isVat
      ? formatToPounds(calculatorResult.total)
      : formatToPounds(calculatorResult.amount);
    console.log("formatted total " + total);
    const vatAmount = formatToPounds(calculatorResult.vat);

    const feeDetails = await getFeeDetails(req);
    const breakdown = createBreakdown(
      calculatorResult.feeBreakdown,
      feeDetails,
      isVat,
    );

    res.render("main/result", {
      total: total,
      isVatRegistered: isVat,
      vatAmount: vatAmount,
      breakdown: breakdown,
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Return the number in a currency format
 * @param {string} amount - currency value to convert
 * @returns {string} - formatted currency value
 */
function formatToPounds(amount) {
  console.log(amount);
  return `£${Number(amount).toFixed(2)}`;
}

/**
 * Turn the breakdown we got from backend into something useful for nunjucks file
 * @param {Array<object>} feeBreakdown - list of fees we got from the backend result calculator
 * @param {Array<object>} savedFeeList - the valid fees we got earlier and stored in session data
 * @param {boolean} isVatRegistered - is VAT applicable for this calculation?
 * @returns {Array<object>} - breakdown summary
 */
function createBreakdown(feeBreakdown, feeDetails, isVatRegistered) {
  let breakdownList = [];

  if (feeBreakdown) {
    for (const fee of feeBreakdown) {
      if (fee.feeType === "totals") {
        if (isVatRegistered) {
          breakdownList.push({
            desc: "Total",
            amount: formatToPounds(fee.total),
          });
          breakdownList.push({
            desc: "of which VAT",
            amount: formatToPounds(fee.vat),
          });
        } else {
          breakdownList.push({
            desc: "Total",
            amount: formatToPounds(fee.amount),
          });
        }
      } else {
        breakdownList.push({
          desc: getDescriptionForFee(feeDetails, fee.feeType),
          amount: formatToPounds(fee.amount),
        });
      }
    }
  }

  return breakdownList;
}

/**
 * Get description for a fee
 * @param {Array<object>} savedFeeList - the fees we got earlier and stored in session data
 * @param {string} feeToFind - fee we are looking for
 * @returns {string | undefined} - description if found
 */
function getDescriptionForFee(feeDetails, feeToFind) {
  const foundFee = feeDetails.find((fee) => fee.levelCode === feeToFind);
  return foundFee?.description;
}
