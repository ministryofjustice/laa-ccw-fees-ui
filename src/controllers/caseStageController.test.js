import { postCaseStagePage, showCaseStagePage } from "./caseStageController";
import { getCaseStages, isValidCaseStage } from "../service/caseStageService";
import { getSessionData } from "../service/sessionDataService";
import { getNextPage, URL_CaseStage } from "../routes/navigator";

jest.mock("../service/caseStageService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

const caseStages = [
  {
    id: "LVL1",
    description: "Level 1",
  },
  {
    id: "LVL2",
    description: "Level 2",
  },
];
const level1 = "LVL1";

describe("showCaseStagePage", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    getCaseStages.mockReturnValue(caseStages);
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render case stage page", () => {
    showCaseStagePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/caseStage", {
      caseStages: caseStages,
      csrfToken: "mocked-csrf-token",
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showCaseStagePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showCaseStagePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("postCaseStagePage", () => {
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
    isValidCaseStage.mockReturnValue(true);

    body.caseStage = level1;
  });

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to result page if valid form data is supplied", () => {
    getNextPage.mockReturnValue("nextPage");

    postCaseStagePage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(sessionData.caseStage).toEqual(level1);
    expect(getNextPage).toHaveBeenCalledWith(URL_CaseStage);
  });

  it("render error page when case stage from form is missing", async () => {
    body.caseStage = null;

    postCaseStagePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.caseStage).toBeUndefined();
  });

  it("render error page when case stage is invalid", async () => {
    isValidCaseStage.mockReturnValue(false);

    postCaseStagePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.caseStage).toBeUndefined();
    expect(isValidCaseStage).toHaveBeenCalledWith(level1);
  });
});
