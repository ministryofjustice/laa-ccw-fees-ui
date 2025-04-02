import { isValidMatterCode1 } from "./matterCode1Service";

describe("isValidMatterCode1", () => {
  it("should return true if valid matterCode1", () => {
    expect(isValidMatterCode1("FAMA")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidMatterCode1("FBMA")).toEqual(false);
  });
});
