import { isValidLawCategory, getLawCategories } from "../service/lawCategoryService";
import { getSessionData } from "../utils";

export function showLawCategoryPage(req, res) {

    try {
        getSessionData(req);
        
        res.render("main/lawCategory", { csrfToken: req.csrfToken(), categories: getLawCategories() });
      } catch (ex) {
        console.error("Error loading page /law-category: {}", ex.message);
    
        res.render("main/error", {
          status: "An error occurred",
          error: "An error occurred.",
        });
      }
}

export async function postLawCategoryPage(req, res) {
    try {
        const category = req.body.category;
    
        if (category == null) {
          throw new Error("Law Category not defined");
        }

        if (!isValidLawCategory(category)) {
            throw new Error("Law Category is not valid");
        }
    
        req.session.data.lawCategory = category;
    
        res.redirect("/fee-entry");
      } catch (ex) {
        console.error("Error occurred during POST /law-category: {}", ex.message);
    
        res.render("main/error", {
          status: "An error occurred",
          error: "An error occurred posting the answer.",
        });
}
}

