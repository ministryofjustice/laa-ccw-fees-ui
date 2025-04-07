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

    res.render("main/result", {
      total: total,
      isVatRegistered: isVat,
      vatAmount: vatAmount,
    });
  } catch (ex) {
    pageLoadError(req, res, ex);
  }
}

/**
 * Return the number in a currency format
 * @param {number} amount - currency value to convert
 * @returns {string} - formatted currency value
 */
function formatToPounds(amount) {
  return `£${amount.toFixed(2)}`;
}
