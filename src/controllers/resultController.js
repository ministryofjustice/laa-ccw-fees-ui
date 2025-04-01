import { getLawCategoryDescription } from '../service/lawCategoryService';
import { getSessionData } from '../utils';

/**
 * Load the page to display the result
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 */
export function showResultPage(req, res) {
 try {
    const data = getSessionData(req);
    console.log(data)
    const result = data?.result;

    if (result == null) {
      throw new Error("Result not defined");
    }

    const lawCategory = data?.lawCategory;
    if (lawCategory == null) {
      throw new Error("Law category not defined");
    }

    res.render("main/result", {
      number: result,
      category: getLawCategoryDescription(lawCategory),
    });
  } catch (ex) {
    console.error("Error occurred while loading /result: {}", ex.message);

    res.render("main/error", {
      status: "An error occurred",
      error: "An error occurred loading the page.",
    });
  }
}