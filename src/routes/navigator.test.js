import {
  getNextPage,
  NavigationError,
  URL_CaseStage,
  URL_ClaimStart,
  URL_ErrorPage,
  URL_LondonRate,
  URL_MatterCode1,
  URL_MatterCode2,
  URL_Result,
  URL_Start,
  URL_VatIndicator,
} from "./navigator";

describe("getNextPage", () => {
  describe("it should return the next page when currently on the", () => {
    it("Start page", () => {
      expect(getNextPage(URL_Start)).toEqual(URL_ClaimStart);
    });

    it("Claim Start page", () => {
      expect(getNextPage(URL_ClaimStart)).toEqual(URL_LondonRate);
    });

    it("London Rate page", () => {
      expect(getNextPage(URL_LondonRate)).toEqual(URL_MatterCode1);
    });

    it("Matter Code 1 page", () => {
      expect(getNextPage(URL_MatterCode1)).toEqual(URL_MatterCode2);
    });

    it("Matter Code 2 page", () => {
      expect(getNextPage(URL_MatterCode2)).toEqual(URL_CaseStage);
    });

    it("Case Stage page", () => {
      expect(getNextPage(URL_CaseStage)).toEqual(URL_VatIndicator);
    });

    it("VAT Indicator page", () => {
      expect(getNextPage(URL_VatIndicator)).toEqual(URL_Result);
    });
  });

  describe("it should throw an NavigationError", () => {
    it("when currently on the Result page", () => {
      expect(() => getNextPage(URL_Result)).toThrow(NavigationError);
    });

    it("when currently on the Error page", () => {
      expect(() => getNextPage(URL_ErrorPage)).toThrow(NavigationError);
    });

    it("when page is not recognised", () => {
      expect(() => getNextPage("unknownPage")).toThrow(NavigationError);
    });
  });
});
