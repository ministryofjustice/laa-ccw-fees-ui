import { isValidMatterCode2 } from "./matterCode2Service";

describe("isValidMatterCode2", () => {
  it("should return true if valid matterCode2", () => {
    expect(isValidMatterCode2("FPET")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidMatterCode2("FBMA")).toEqual(false);
  });
});
