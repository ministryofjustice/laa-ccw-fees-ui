import { isValidLawCategory } from "./lawCategoryService";

describe("isValidLawCategory", () => {
  it("should return true if valid category", () => {
    expect(isValidLawCategory("family")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidLawCategory("family-divorce")).toEqual(false);
  });
});
