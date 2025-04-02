import { getSessionData } from "../utils";
import { getUrl } from "../routes/urls";
import {
  getLondonRates,
  isValidLondonRate,
} from "../service/londonRateService";
import { postLondonRatePage, showLondonRatePage } from "./londonRateController";

jest.mock("../service/londonRateService");
jest.mock("../utils/sessionHelper");

const londonRates = [
  {
    id: "LDN",
    description: "London",
  },
  {
    id: "NLDN",
    description: "Non-London",
  },
];

const london = "LDN";

describe("showLondonRatePage", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    getLondonRates.mockReturnValue(londonRates);
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render claim start page", () => {
    showLondonRatePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/londonRate", {
      rates: londonRates,
      csrfToken: "mocked-csrf-token",
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showLondonRatePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showLondonRatePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("postLondonRatePage", () => {
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
    isValidLondonRate.mockReturnValue(true);

    body.londonRate = london;
  });

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to result page if valid form data is supplied", () => {
    postLondonRatePage(req, res);

    expect(res.redirect).toHaveBeenCalledWith(getUrl("matterCode1"));
    expect(sessionData.londonRate).toEqual(london);

    expect(isValidLondonRate).toHaveBeenCalledWith(london);
  });

  it("render error page when London Rate from form is missing", async () => {
    body.londonRate = null;

    postLondonRatePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.londonRate).toBeUndefined();
  });

  it("render error page when London Rate is invalid", async () => {
    isValidLondonRate.mockReturnValue(false);

    postLondonRatePage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.londonRate).toBeUndefined();
    expect(isValidLondonRate).toHaveBeenCalledWith(london);
  });
});
