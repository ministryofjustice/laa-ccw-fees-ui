import { isValidLawCategory, getLawCategoryDescription } from "./lawCategoryService";

describe("isValidLawCategory", () => {
  it("should return true if valid category", () => {
    expect(isValidLawCategory("family")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidLawCategory("family-divorce")).toEqual(false);
  });
});

describe("getLawCategoryDescription", () => {
  it("should return description if valid category", () => {
    expect(getLawCategoryDescription("family")).toEqual("Family");
  });

  it("should return null if invalid category", () => {
    expect(getLawCategoryDescription("family-divorce")).toEqual(null);
  });
});
