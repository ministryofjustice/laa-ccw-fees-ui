import { getNextPage, URL_Start } from "../routes/navigator";
import { postStartPage, showStartPage } from "./startController";

jest.mock("../service/londonRateService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

describe("showStartPage", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render start page", () => {
    showStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/index", {
      csrfToken: "mocked-csrf-token",
      skipBackLink: true,
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred.",
      status: "An error occurred",
    });
  });
});

describe("postStartPage", () => {
  let sessionData = {};

  let req = {
    session: {
      data: sessionData,
    },
  };
  let res = {
    redirect: jest.fn(),
  };

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to next page", () => {
    getNextPage.mockReturnValue("nextPage");

    postStartPage(req, res);

    sessionData = {
      blah: "foo",
      type: "213",
    };

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(req.session.data).toEqual({});
    expect(getNextPage).toHaveBeenCalledWith(URL_Start, req.session.data);
  });
});
