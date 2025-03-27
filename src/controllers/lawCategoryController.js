import { isValidLawCategory, getLawCategories } from "../service/lawCategoryService";

export function showLawCategoryPage(req, res) {

    try {
        const data = req.session?.data
         if (data == null){
            throw new Error("No session data found");
        }
        
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

