import {
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
import { cleanData, getSessionData } from "./sessionDataService";

describe("cleanData", () => {
  let req = {
    session: {
      data: {},
    },
  };

  it("should clean data when given ClaimStart page", () => {
    req.session.data.validMatterCode1s = "a";
    req.session.data.validMatterCode2s = "b";
    req.session.data.matterCode1 = "c";
    req.session.data.matterCode2 = "d";
    req.session.data.caseStage = "e";
    req.session.data.londonRate = "f";
    req.session.data.vatIndicator = "g";
    req.session.data.startDate = "h";
    req.session.data.validCaseStages = "i";

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
  });

  it("should clean data when given MatterCode1 page", () => {
    req.session.data.validMatterCode1s = "a";
    req.session.data.validMatterCode2s = "b";
    req.session.data.matterCode1 = "c";
    req.session.data.matterCode2 = "d";
    req.session.data.caseStage = "e";
    req.session.data.londonRate = "f";
    req.session.data.vatIndicator = "g";
    req.session.data.startDate = "h";
    req.session.data.validCaseStages = "i";

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
  });

  it("should clean data when given MatterCode2 page", () => {
    req.session.data.validMatterCode1s = "a";
    req.session.data.validMatterCode2s = "b";
    req.session.data.matterCode1 = "c";
    req.session.data.matterCode2 = "d";
    req.session.data.caseStage = "e";
    req.session.data.londonRate = "f";
    req.session.data.vatIndicator = "g";
    req.session.data.startDate = "h";
    req.session.data.validCaseStages = "i";

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
  });

  it.each([
    URL_Start,
    URL_Result,
    URL_LondonRate,
    URL_ErrorPage,
    URL_CaseStage,
    URL_VatIndicator,
  ])("should not clean data if any other page", (urlToTest) => {
    req.session.data.validMatterCode1s = "a";
    req.session.data.validMatterCode2s = "b";
    req.session.data.matterCode1 = "c";
    req.session.data.matterCode2 = "d";
    req.session.data.caseStage = "e";
    req.session.data.londonRate = "f";
    req.session.data.vatIndicator = "g";
    req.session.data.startDate = "h";
    req.session.data.validCaseStages = "i";

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
  });
});

describe("getSessionData", () => {
  it("should return the session data object if defined but empty", () => {
    const req = {
      session: {
        data: {},
      },
    };

    expect(getSessionData(req)).toEqual({});
  });

  it("should return the session data object if defined and populated", () => {
    const data = {
      lawCategory: "family",
    };

    const req = {
      session: {
        data: data,
      },
    };

    expect(getSessionData(req)).toEqual(data);
  });

  it("should throw an error if session data missing", () => {
    const req = {
      session: {},
    };

    expect(() => getSessionData(req)).toThrow(Error);
  });

  it("should throw an error if session is missing", () => {
    const req = {};

    expect(() => getSessionData(req)).toThrow(Error);
  });
});
