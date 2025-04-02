import { isValidCaseStage } from "./caseStageService";

describe("isValidCaseStage", () => {
  it("should return true if valid case stage", () => {
    expect(isValidCaseStage("LVL1")).toEqual(true);
  });

  it("should return false if invalid case stage", () => {
    expect(isValidCaseStage("LVL3")).toEqual(false);
  });
});
