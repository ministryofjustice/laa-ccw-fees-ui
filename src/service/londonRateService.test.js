import { isValidLondonRate } from "./londonRateService";

describe("isValidLondonRate", () => {
  it("should return true if valid category", () => {
    expect(isValidLondonRate("LDN")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidLondonRate("NCL")).toEqual(false);
  });
});
