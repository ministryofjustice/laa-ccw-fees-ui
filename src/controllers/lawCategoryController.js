import { lawCategories } from "../service/lawCategoryService";

export function showLawCategoryPage(req, res) {

    try {    
        res.render("main/lawCategory", { csrfToken: req.csrfToken(), categories: lawCategories });
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
    
        //TODO make sure it is in the list...
        if (category == null) {
          throw new Error("Law Category not defined");
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

