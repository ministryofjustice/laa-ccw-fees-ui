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
import { getNextPage, URL_ClaimStart } from "../routes/navigator";
import { cleanData, getSessionData } from "../service/sessionDataService";

jest.mock("../service/lawCategoryService");
jest.mock("../utils/dateTimeUtils");
jest.mock("../routes/navigator.js");
jest.mock("../service/sessionDataService");

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
  let req = {};
  let res = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  beforeEach(() => {
    isValidLawCategory.mockReturnValue(true);
    validateEnteredDate.mockReturnValue(true);

    req = {
      session: {
        data: {},
      },
      body: {},
    };

    req.body.category = familyLaw;
    req.body.date = today;

    req.session.data.validMatterCode1s = "some data here";
  });

  it("should redirect to result page if valid form data is supplied", () => {
    getNextPage.mockReturnValue("nextPage");

    postClaimStartPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(req.session.data.lawCategory).toEqual(familyLaw);
    expect(req.session.data.startDate).toEqual(today);
    expect(getNextPage).toHaveBeenCalledWith(URL_ClaimStart);
  });

  it("should clean up data that depends on law category if law category changed", () => {
    req.session.data.lawCategory = "IMM";
    postClaimStartPage(req, res);

    expect(cleanData).toHaveBeenCalledWith(req, URL_ClaimStart);
  });

  it("should keep data that depends on law category if law category not changed", () => {
    req.session.data.lawCategory = familyLaw;
    postClaimStartPage(req, res);

    expect(cleanData).toHaveBeenCalledTimes(0);
  });

  it("render error page when law category from form is missing", async () => {
    req.body.category = null;

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(req.session.data.lawCategory).toBeUndefined();
    expect(req.session.data.startDate).toBeUndefined();
  });

  it("render error page when start date from form is missing", async () => {
    req.body.date = null;

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(req.session.data.lawCategory).toBeUndefined();
    expect(req.session.data.startDate).toBeUndefined();
  });

  it("render error page when law category is invalid", async () => {
    isValidLawCategory.mockReturnValue(false);

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(req.session.data.lawCategory).toBeUndefined();
    expect(req.session.data.startDate).toBeUndefined();
    expect(isValidLawCategory).toHaveBeenCalledWith(familyLaw);
  });

  it("render error page when date validation returns false", async () => {
    validateEnteredDate.mockReturnValue(false);

    postClaimStartPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(req.session.data.lawCategory).toBeUndefined();
    expect(req.session.data.startDate).toBeUndefined();
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

    expect(req.session.data.lawCategory).toBeUndefined();
    expect(req.session.data.startDate).toBeUndefined();
    expect(validateEnteredDate).toHaveBeenCalledWith(today);
  });
});
