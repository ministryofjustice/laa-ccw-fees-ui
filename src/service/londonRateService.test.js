import { getLondonRates, isValidLondonRate } from "./londonRateService";

describe("getLondonRates", () => {
  it("should return values for London Rate", () => {
    expect(getLondonRates().length).toEqual(2);
  });
});

describe("isValidLondonRate", () => {
  it("should return true if valid category", () => {
    expect(isValidLondonRate("LDN")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidLondonRate("NCL")).toEqual(false);
  });
});
