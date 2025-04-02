import { postFeeEntryPage, showFeeEntryPage } from "./feeEntryController";
import { getNextPage, URL_FeeEntry } from "../routes/navigator";
import { getSessionData } from "../utils";

jest.mock("../utils/sessionHelper");
jest.mock("../routes/navigator.js");

describe("showFeeEntryPage", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render fee entry page", async () => {
    showFeeEntryPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/feeEntry", {
      csrfToken: "mocked-csrf-token",
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showFeeEntryPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no session data", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showFeeEntryPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("POST /fee-entry", () => {
  let sessionData = {};

  let req = {
    session: {
      data: sessionData,
    },
    body: {},
    axiosMiddleware: {
      post: jest.fn(),
    },
  };
  let res = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  beforeEach(() => {
    req.body.fee = "1234.56";
  });

  afterEach(() => {
    sessionData = {};
    req.body = {};
  });

  it("should redirect to result page if successful call service", async () => {
    req.axiosMiddleware.post.mockResolvedValue({
      status: 200,
      data: "236.00",
    });

    getNextPage.mockReturnValue("nextPage");

    await postFeeEntryPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");

    // Save value so result page can load it
    expect(sessionData.result).toEqual("236.00");
    expect(req.axiosMiddleware.post).toHaveBeenCalledWith("/fees/1234.56");
    expect(getNextPage).toHaveBeenCalledWith(URL_FeeEntry);
  });

  describe("should error", () => {
    it("when api call fails", async () => {
      req.axiosMiddleware.post.mockImplementation(() => {
        throw new Error("API connection issue");
      });

      await postFeeEntryPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(sessionData.result).toBeUndefined();
      expect(req.axiosMiddleware.post).toHaveBeenCalledWith("/fees/1234.56");
    });

    it("when data from form is missing", async () => {
      req.body.fee = null;

      await postFeeEntryPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(sessionData.result).toBeUndefined();
      expect(req.axiosMiddleware.post).toHaveBeenCalledTimes(0);
    });

    it("when data from form is not the right type", async () => {
      req.body.fee = "hello";

      await postFeeEntryPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(sessionData.result).toBeUndefined();
      expect(req.axiosMiddleware.post).toHaveBeenCalledTimes(0);
    });
  });
});
