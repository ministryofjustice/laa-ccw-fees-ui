import { postClaimStartPage, showClaimStartPage } from "./claimStartController";
import {
  getLawCategories,
  isValidLawCategory,
} from "../service/lawCategoryService";
import {
  todayString,
  validateEnteredDate,
  DateInputError,
} from "../utils/dateTimeUtils";
import { getSessionData } from "../utils";
import { getNextPage, URL_ClaimStart } from "../routes/navigator";

jest.mock("../service/lawCategoryService");
jest.mock("../utils/dateTimeUtils");
jest.mock("../utils/sessionHelper");
jest.mock("../routes/navigator.js");

const today = "31/03/2025";
const lawCategories = [
  {
    id: "family",
    description: "Family",
  },
  {
    id: "immigration",
    description: "Immigration",
  },
];
const familyLaw = "family";

describe("showClaimStartPage", () => {
  let req = {
    csrfToken: jest.fn(),
  };
  let res = {
    render: jest.fn(),
  };

  beforeEach(() => {
    todayString.mockReturnValue(today);
    getLawCategories.mockReturnValue(lawCategories);
    getSessionData.mockReturnValue({});

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render claim start page", () => {
    showClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/claimStart", {
      categories: lawCategories,
      csrfToken: "mocked-csrf-token",
      today: today,
    });
  });

  it("should render error page if fails to load page", async () => {
    req.csrfToken.mockImplementation(() => {
      throw new Error("token problems");
    });

    showClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });
});

describe("postClaimStartPage", () => {
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
    isValidLawCategory.mockReturnValue(true);
    validateEnteredDate.mockReturnValue(true);

    body.category = familyLaw;
    body.date = today;
  });

  afterEach(() => {
    sessionData = {};
  });

  it("should redirect to result page if valid form data is supplied", () => {
    getNextPage.mockReturnValue("nextPage");

    postClaimStartPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(sessionData.lawCategory).toEqual(familyLaw);
    expect(sessionData.startDate).toEqual(today);
    expect(getNextPage).toHaveBeenCalledWith(URL_ClaimStart);
  });

  it("render error page when law category from form is missing", async () => {
    body.category = null;

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.lawCategory).toBeUndefined();
    expect(sessionData.startDate).toBeUndefined();
  });

  it("render error page when start date from form is missing", async () => {
    body.date = null;

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(sessionData.lawCategory).toBeUndefined();
    expect(sessionData.startDate).toBeUndefined();
  });

  it("render error page when law category is invalid", async () => {
    isValidLawCategory.mockReturnValue(false);

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.lawCategory).toBeUndefined();
    expect(sessionData.startDate).toBeUndefined();
    expect(isValidLawCategory).toHaveBeenCalledWith(familyLaw);
  });

  it("render error page when date validation returns false", async () => {
    validateEnteredDate.mockReturnValue(false);

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.lawCategory).toBeUndefined();
    expect(sessionData.startDate).toBeUndefined();
    expect(validateEnteredDate).toHaveBeenCalledWith(today);
  });

  it("render error page when date validation throws error", async () => {
    validateEnteredDate.mockImplementation(() => {
      throw new DateInputError("Date error");
    });

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(sessionData.lawCategory).toBeUndefined();
    expect(sessionData.startDate).toBeUndefined();
    expect(validateEnteredDate).toHaveBeenCalledWith(today);
  });
});
