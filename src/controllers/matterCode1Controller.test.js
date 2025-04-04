import { getSessionData } from "../utils";
import {
  getMatterCode1s,
  isValidMatterCode1,
} from "../service/matterCode1Service";
import {
  postMatterCode1Page,
  showMatterCode1Page,
} from "./matterCode1Controller";
import { getNextPage, URL_MatterCode1 } from "../routes/navigator";

jest.mock("../service/matterCode1Service");
jest.mock("../utils/sessionHelper");
jest.mock("../routes/navigator.js");

const matterCode1s = [
  {
    matterCode: "MC1A",
    description: "Matter code A",
  },
  {
    matterCode: "MC1B",
    description: "Matter code B",
  },
];

const chosenMatterCode = "MC1A";

describe("showMatterCode1Page", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    getMatterCode1s.mockResolvedValue(matterCode1s);
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render claim start page", async () => {
    await showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/matterCode", {
      matterCodes: matterCode1s,
      csrfToken: "mocked-csrf-token",
      id: "matterCode1",
      label: "Matter Code 1",
    });

    expect(getMatterCode1s).toHaveBeenCalledWith(req);
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    await showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    await showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if getMatterCode1s call throws error", async () => {
    getMatterCode1s.mockImplementation(() => {
      throw new Error("API error");
    });

    await showMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });

    expect(getMatterCode1s).toHaveBeenCalledWith(req);
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
    getMatterCode1s.mockResolvedValue(matterCode1s);
    isValidMatterCode1.mockReturnValue(true);

    body.matterCode1 = chosenMatterCode;
  });

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to result page if valid form data is supplied", async () => {
    getNextPage.mockReturnValue("nextPage");

    await postMatterCode1Page(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(sessionData.matterCode1).toEqual(chosenMatterCode);

    expect(isValidMatterCode1).toHaveBeenCalledWith(
      matterCode1s,
      chosenMatterCode,
    );
    expect(getNextPage).toHaveBeenCalledWith(URL_MatterCode1);
    expect(getMatterCode1s).toHaveBeenCalledWith(req);
  });

  it("render error page when Matter Code 1 from form is missing", async () => {
    body.matterCode1 = null;

    await postMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.matterCode1).toBeUndefined();
  });

  it("render error page when Matter Code 1 is invalid", async () => {
    isValidMatterCode1.mockReturnValue(false);

    await postMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.matterCode1).toBeUndefined();
    expect(getMatterCode1s).toHaveBeenCalledWith(req);
    expect(isValidMatterCode1).toHaveBeenCalledWith(
      matterCode1s,
      chosenMatterCode,
    );
  });

  it("should render error page if getMatterCode1s call throws error", async () => {
    getMatterCode1s.mockImplementation(() => {
      throw new Error("API error");
    });

    await postMatterCode1Page(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(getMatterCode1s).toHaveBeenCalledWith(req);
  });
});
