import {
  URL_ClaimStart,
  URL_MatterCode1,
  URL_MatterCode2,
} from "../routes/navigator";
import { cleanData } from "./sessionDataService";

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

    cleanData(req, URL_ClaimStart);

    expect(req.session.data.validMatterCode1s).toEqual(null);
    expect(req.session.data.validMatterCode2s).toEqual(null);
    expect(req.session.data.matterCode1).toEqual(null);
    expect(req.session.data.matterCode2).toEqual(null);
    expect(req.session.data.caseStage).toEqual(null);
    expect(req.session.data.londonRate).toEqual(null);
    expect(req.session.data.vatIndicator).toEqual(null);
    expect(req.session.data.startDate).toEqual("h");
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

    cleanData(req, URL_MatterCode1);

    expect(req.session.data.validMatterCode1s).toEqual("a");
    expect(req.session.data.validMatterCode2s).toEqual(null);
    expect(req.session.data.matterCode1).toEqual("c");
    expect(req.session.data.matterCode2).toEqual(null);
    expect(req.session.data.caseStage).toEqual(null);
    expect(req.session.data.londonRate).toEqual(null);
    expect(req.session.data.vatIndicator).toEqual(null);
    expect(req.session.data.startDate).toEqual("h");
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

    cleanData(req, URL_MatterCode2);

    expect(req.session.data.validMatterCode1s).toEqual("a");
    expect(req.session.data.validMatterCode2s).toEqual("b");
    expect(req.session.data.matterCode1).toEqual("c");
    expect(req.session.data.matterCode2).toEqual("d");
    expect(req.session.data.caseStage).toEqual(null);
    expect(req.session.data.londonRate).toEqual(null);
    expect(req.session.data.vatIndicator).toEqual(null);
    expect(req.session.data.startDate).toEqual("h");
  });
});
