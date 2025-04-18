import { getSessionData } from "../service/sessionDataService";
import {
  postVatIndicatorRate,
  showVatIndicatorPage,
} from "./vatIndicatorController";
import { getNextPage, URL_VatIndicator } from "../routes/navigator";

jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

describe("showVatIndicatorPage", () => {
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

  it("should render VAT indicator page", () => {
    showVatIndicatorPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/vatIndicator", {
      csrfToken: "mocked-csrf-token",
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showVatIndicatorPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showVatIndicatorPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("postVatIndicatorPage", () => {
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

  it("should redirect to result page if value is yes", () => {
    getNextPage.mockReturnValue("nextPage");

    body.vatIndicator = "yes";
    postVatIndicatorRate(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(sessionData.vatIndicator).toEqual(true);

    expect(getNextPage).toHaveBeenCalledWith(
      URL_VatIndicator,
      req.session.data,
    );
  });

  it("should redirect to result page if value is no", () => {
    getNextPage.mockReturnValue("nextPage");

    body.vatIndicator = "no";
    postVatIndicatorRate(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(sessionData.vatIndicator).toEqual(false);

    expect(getNextPage).toHaveBeenCalledWith(
      URL_VatIndicator,
      req.session.data,
    );
  });

  it("render error page when VAT Indicator from form is missing", async () => {
    body.vatIndicator = null;
    sessionData = {};
    postVatIndicatorRate(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.vatIndicator).toBeUndefined();
  });

  it("render error page when VAT Indicator is invalid", async () => {
    body.vatIndicator = "foo";
    sessionData = {};

    postVatIndicatorRate(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.vatIndicator).toBeUndefined();
  });
});
