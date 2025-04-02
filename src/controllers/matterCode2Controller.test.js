import { getSessionData } from "../utils";
import { getUrl } from "../routes/urls";
import {
  getMatterCode2s,
  isValidMatterCode2,
} from "../service/matterCode2Service";
import {
  postMatterCode2Page,
  showMatterCode2Page,
} from "./matterCode2Controller";

jest.mock("../service/matterCode2Service");
jest.mock("../utils/sessionHelper");

const matterCode2s = [
  {
    id: "MC2A",
    description: "Matter code A",
  },
  {
    id: "MC2B",
    description: "Matter code B",
  },
];

const chosenMatterCode = "MC2A";

describe("showMatterCode2Page", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    getMatterCode2s.mockReturnValue(matterCode2s);
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render claim start page", () => {
    showMatterCode2Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/matterCode", {
      matterCodes: matterCode2s,
      csrfToken: "mocked-csrf-token",
      id: "matterCode2",
      label: "Matter Code 2"

    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showMatterCode2Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showMatterCode2Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("postMatterCode2Page", () => {
  let body = {};
  let sessionData = {};

  let req = {
    session: {
      data: sessionData,
    },
    body: body,
  };
  let res = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  beforeEach(() => {
    isValidMatterCode2.mockReturnValue(true);

    body.matterCode2 = chosenMatterCode;
  });

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to result page if valid form data is supplied", () => {
    postMatterCode2Page(req, res);

    expect(res.redirect).toHaveBeenCalledWith(getUrl("feeEntry"));
    expect(sessionData.matterCode2).toEqual(chosenMatterCode);

    expect(isValidMatterCode2).toHaveBeenCalledWith(chosenMatterCode);
  });

  it("render error page when Matter Code 2 from form is missing", async () => {
    body.matterCode2 = null;

    postMatterCode2Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.matterCode2).toBeUndefined();
  });

  it("render error page when Matter Code 2 is invalid", async () => {
    isValidMatterCode2.mockReturnValue(false);

    postMatterCode2Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.matterCode2).toBeUndefined();
    expect(isValidMatterCode2).toHaveBeenCalledWith(chosenMatterCode);
  });
});
