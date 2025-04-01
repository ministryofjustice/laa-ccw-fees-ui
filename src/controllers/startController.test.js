import { getUrl } from "../routes/urls";
import { postStartPage, showStartPage } from "./startController";

jest.mock("../service/londonRateService");
jest.mock("../utils/sessionHelper");

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
    postStartPage(req, res);

    sessionData = {
      blah: "foo",
      type: "213",
    };

    expect(res.redirect).toHaveBeenCalledWith(getUrl("claimStart"));
    expect(req.session.data).toEqual({});
  });
});
