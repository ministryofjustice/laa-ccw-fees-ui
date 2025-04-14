import { getSessionData } from "../service/sessionDataService";
import { getCalculationResult } from "../service/feeCalculatorService";
import { pageLoadError } from "./errorController";

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
    const vatAmount = formatToPounds(calculatorResult.vat);
    const breakdown = createBreakdown(calculatorResult.feeBreakdown, data.validAdditionalFees, isVat)

    res.render("main/result", {
      total: total,
      isVatRegistered: isVat,
      vatAmount: vatAmount,
      breakdown: breakdown
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
  return `£${Number(amount).toFixed(2)}`;
}

function createBreakdown(feeBreakdown, feeList, isVatRegistered) {

  let breakdownList = []

  for (const fee of feeBreakdown) {
    if (fee.feeType === "totals") {
      if (isVatRegistered) {
        breakdownList.push({
          desc: "Total",
          amount: formatToPounds(fee.total),
        })
        breakdownList.push({
          desc: "of which VAT",
          amount: formatToPounds(fee.vat)
        })
      } else {
        breakdownList.push({
          desc: "Total",
          amount: formatToPounds(fee.amount),
        })
      }
    } else {
      breakdownList.push({
        desc: getFeeForLevelCode(feeList, fee),
        amount: formatToPounds(fee.amount),
      })
    }
  }

  return breakdownList;

}

function getFeeForLevelCode(feeList, feeToFind) {
  return feeList.find(
    (fee) => fee.levelCode == feeToFind.levelCode
  )
}
