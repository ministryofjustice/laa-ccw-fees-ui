import {
  URL_AdditionalCosts,
  URL_CaseStage,
  URL_ClaimStart,
  URL_ErrorPage,
  URL_LondonRate,
  URL_MatterCode1,
  URL_MatterCode2,
  URL_Result,
  URL_Start,
  URL_VatIndicator,
} from "../routes/navigator";
import { cleanData, validateSession } from "./sessionDataService";

describe("cleanData", () => {
  let req = {
    session: {
      data: {},
    },
  };

  beforeEach(() => {
    req.session.data.validMatterCode1s = "a";
    req.session.data.validMatterCode2s = "b";
    req.session.data.matterCode1 = "c";
    req.session.data.matterCode2 = "d";
    req.session.data.caseStage = "e";
    req.session.data.londonRate = "f";
    req.session.data.vatIndicator = "g";
    req.session.data.startDate = "h";
    req.session.data.validCaseStages = "i";
    req.session.data.additionalCosts = "j";
    req.session.data.feeDetails = "k";
  });

  it("should clean data when given ClaimStart page", () => {
    cleanData(req, URL_ClaimStart);

    expect(req.session.data.validMatterCode1s).toEqual(null);
    expect(req.session.data.validMatterCode2s).toEqual(null);
    expect(req.session.data.matterCode1).toEqual(null);
    expect(req.session.data.matterCode2).toEqual(null);
    expect(req.session.data.caseStage).toEqual(null);
    expect(req.session.data.londonRate).toEqual(null);
    expect(req.session.data.vatIndicator).toEqual(null);
    expect(req.session.data.startDate).toEqual("h");
    expect(req.session.data.validCaseStages).toEqual(null);
    expect(req.session.data.additionalCosts).toEqual(null);
    expect(req.session.data.feeDetails).toEqual(null);
  });

  it("should clean data when given MatterCode1 page", () => {
    cleanData(req, URL_MatterCode1);

    expect(req.session.data.validMatterCode1s).toEqual("a");
    expect(req.session.data.validMatterCode2s).toEqual(null);
    expect(req.session.data.matterCode1).toEqual("c");
    expect(req.session.data.matterCode2).toEqual(null);
    expect(req.session.data.caseStage).toEqual(null);
    expect(req.session.data.londonRate).toEqual(null);
    expect(req.session.data.vatIndicator).toEqual(null);
    expect(req.session.data.startDate).toEqual("h");
    expect(req.session.data.validCaseStages).toEqual(null);
    expect(req.session.data.additionalCosts).toEqual(null);
    expect(req.session.data.feeDetails).toEqual(null);
  });

  it("should clean data when given MatterCode2 page", () => {
    cleanData(req, URL_MatterCode2);

    expect(req.session.data.validMatterCode1s).toEqual("a");
    expect(req.session.data.validMatterCode2s).toEqual("b");
    expect(req.session.data.matterCode1).toEqual("c");
    expect(req.session.data.matterCode2).toEqual("d");
    expect(req.session.data.caseStage).toEqual(null);
    expect(req.session.data.londonRate).toEqual(null);
    expect(req.session.data.vatIndicator).toEqual(null);
    expect(req.session.data.startDate).toEqual("h");
    expect(req.session.data.validCaseStages).toEqual(null);
    expect(req.session.data.additionalCosts).toEqual(null);
    expect(req.session.data.feeDetails).toEqual(null);
  });

  it.each([
    URL_Start,
    URL_Result,
    URL_LondonRate,
    URL_ErrorPage,
    URL_CaseStage,
    URL_VatIndicator,
    URL_AdditionalCosts,
  ])("should not clean data if any other page", (urlToTest) => {
    cleanData(req, urlToTest);

    expect(req.session.data.validMatterCode1s).toEqual("a");
    expect(req.session.data.validMatterCode2s).toEqual("b");
    expect(req.session.data.matterCode1).toEqual("c");
    expect(req.session.data.matterCode2).toEqual("d");
    expect(req.session.data.caseStage).toEqual("e");
    expect(req.session.data.londonRate).toEqual("f");
    expect(req.session.data.vatIndicator).toEqual("g");
    expect(req.session.data.startDate).toEqual("h");
    expect(req.session.data.validCaseStages).toEqual("i");
    expect(req.session.data.additionalCosts).toEqual("j");
    expect(req.session.data.feeDetails).toEqual("k");
  });
});

describe("validateSession", () => {
  it("should return true if session data object is defined but empty", () => {
    const req = {
      session: {
        data: {},
      },
    };

    expect(validateSession(req)).toEqual(true);
  });

  it("should return true if defined and populated", () => {
    const data = {
      lawCategory: "family",
    };

    const req = {
      session: {
        data: data,
      },
    };

    expect(validateSession(req)).toEqual(true);
  });

  it("should throw an error if session data missing", () => {
    const req = {
      session: {},
    };

    expect(() => validateSession(req)).toThrow(Error);
  });

  it("should throw an error if session is missing", () => {
    const req = {};

    expect(() => validateSession(req)).toThrow(Error);
  });
});
