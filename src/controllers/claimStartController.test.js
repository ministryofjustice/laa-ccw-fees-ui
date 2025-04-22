import { postClaimStartPage, showClaimStartPage } from "./claimStartController";
import { getLawCategories } from "../service/lawCategoryService";
import { todayString } from "../utils/dateTimeUtils";
import { getNextPage, URL_ClaimStart } from "../routes/navigator";
import { cleanData, getSessionData } from "../service/sessionDataService";
import { validateClaimStart } from "./validations/claimStartValidator";

jest.mock("../service/lawCategoryService");
jest.mock("../utils/dateTimeUtils");
jest.mock("../routes/navigator.js");
jest.mock("../service/sessionDataService");
jest.mock("./validations/claimStartValidator");

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

describe("claimStartController", () => {
  describe("showClaimStartPage", () => {
    let req = {
      csrfToken: jest.fn(),
      session: {},
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
        errors: {},
        formValues: {},
      });
    });

    it("should render page with validation errors if session has errors in", () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2, value2: 3 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;
      showClaimStartPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/claimStart", {
        categories: lawCategories,
        csrfToken: "mocked-csrf-token",
        today: today,
        errors: mockError,
        formValues: mockFormValues,
      });
    });

    it("should pre-populate values if stored in session data", () => {
      getSessionData.mockReturnValue({
        startDate: today,
        lawCategory: familyLaw,
      });

      showClaimStartPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/claimStart", {
        categories: lawCategories,
        csrfToken: "mocked-csrf-token",
        today: today,
        errors: {},
        formValues: {
          date: today,
          category: familyLaw,
        },
      });
    });

    it("should delete validation errors from session if been supplied them", () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2, value2: 3 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;
      showClaimStartPage(req, res);

      expect(req.session.formError).toBeUndefined();
      expect(req.session.formValues).toBeUndefined();
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
      validateClaimStart.mockReturnValue({});

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
      expect(req.session.formValues).toBeUndefined();
      expect(req.session.formError).toBeUndefined();
      expect(getNextPage).toHaveBeenCalledWith(
        URL_ClaimStart,
        req.session.data,
      );
      expect(validateClaimStart).toHaveBeenCalledWith(today, familyLaw);
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

    it("redirect to show the errors when data is invalid", async () => {
      const mockError = {
        list: [{ error: "error" }],
      };
      validateClaimStart.mockReturnValue(mockError);

      postClaimStartPage(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_ClaimStart);
      expect(req.session.formError).toEqual(mockError);
      expect(req.session.formValues).toEqual({
        date: today,
        category: familyLaw,
      });

      expect(req.session.data.lawCategory).toBeUndefined();
      expect(req.session.data.startDate).toBeUndefined();
      expect(cleanData).toHaveBeenCalledTimes(0);
    });
  });
});
