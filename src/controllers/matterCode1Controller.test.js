import { getSessionData } from "../utils";
import { getUrl } from "../routes/urls";
import {
  getMatterCode1s,
  isValidMatterCode1,
} from "../service/matterCode1Service";
import { postMatterCode1Page, showMatterCode1Page } from "./matterCode1Controller";

jest.mock("../service/matterCode1Service");
jest.mock("../utils/sessionHelper");

const matterCode1s = [
  {
    id: "MC1A",
    description: "Matter code A",
  },
  {
    id: "MC1B",
    description: "Matter code B",
  },
];

const chosenMatterCode = "MC1a";

describe("showMatterCode1Page", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    getMatterCode1s.mockReturnValue(matterCode1s);
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render claim start page", () => {
    showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/matterCode1", {
      matterCodes: matterCode1s,
      csrfToken: "mocked-csrf-token",
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("postMatterCode1Page", () => {
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
    isValidMatterCode1.mockReturnValue(true);

    body.matterCode1 = chosenMatterCode;
  });

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to result page if valid form data is supplied", () => {
    postMatterCode1Page(req, res);

    expect(res.redirect).toHaveBeenCalledWith(getUrl("feeEntry"));
    expect(sessionData.matterCode1).toEqual(chosenMatterCode);

    expect(isValidMatterCode1).toHaveBeenCalledWith(chosenMatterCode);
  });

  it("render error page when Matter Code 1 from form is missing", async () => {
    body.matterCode1 = null;

    postMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.matterCode1).toBeUndefined();
  });

  it("render error page when Matter Code 1 is invalid", async () => {
    isValidMatterCode1.mockReturnValue(false);

    postMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.matterCode1).toBeUndefined();
    expect(isValidMatterCode1).toHaveBeenCalledWith(chosenMatterCode);
  });
});
