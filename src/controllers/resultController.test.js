import { getLawCategoryDescription } from "../service/lawCategoryService";
import { getSessionData } from "../utils";
import { showResultPage } from "./resultController";

jest.mock("../utils/sessionHelper");
jest.mock("../service/lawCategoryService");

describe("showResultPage", () => {
  let req = {};
  let res = {
    render: jest.fn(),
  };

  let mockSession = {};

  it("should render result page", async () => {
    mockSession = { result: "246.00", lawCategory: "immigration" };
    getSessionData.mockReturnValue(mockSession);
    getLawCategoryDescription.mockReturnValue("Immigration");

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      number: "246.00",
      category: "Immigration",
    });
  });

  it("should error when result is missing", async () => {
    mockSession = {
      data: { lawCategory: "blah" },
    };
    getSessionData.mockReturnValue(mockSession);

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should error when law category is missing", async () => {
    mockSession = {
      data: { result: "1234.32" },
    };
    getSessionData.mockReturnValue(mockSession);

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should error when session is missing", async () => {
    mockSession = null;
    getSessionData.mockReturnValue(mockSession);

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should error when session data is missing", async () => {
    mockSession = {
      otherField: "blah",
    };
    getSessionData.mockReturnValue(mockSession);

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});
