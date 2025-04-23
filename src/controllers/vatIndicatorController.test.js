import { validateSession } from "../service/sessionDataService";
import {
  postVatIndicatorRate,
  showVatIndicatorPage,
} from "./vatIndicatorController";
import { getNextPage, URL_VatIndicator } from "../routes/navigator";
import { validateVatIndicator } from "./validations/vatIndicatorValidator.js";

jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");
jest.mock("./validations/vatIndicatorValidator");

describe("vatIndicatorController", () => {
  describe("showVatIndicatorPage", () => {
    let req = {
      csrfToken: jest.fn(),
      session: {
        data: {},
      },
    };
    let res = {
      render: jest.fn(),
    };

    beforeEach(() => {
      validateSession.mockReturnValue({});

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render VAT indicator page", () => {
      showVatIndicatorPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/vatIndicator", {
        csrfToken: "mocked-csrf-token",
        errors: {},
        formValues: {},
      });
    });

    it("should pre-populate values if stored in session data", () => {
      req.session.data.vatIndicator = true;

      showVatIndicatorPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/vatIndicator", {
        csrfToken: "mocked-csrf-token",
        errors: {},
        formValues: {
          vatIndicator: true,
        },
      });
    });

    it("should render page with validation errors if session has errors in", () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2, value2: 3 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;
      showVatIndicatorPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/vatIndicator", {
        csrfToken: "mocked-csrf-token",
        errors: mockError,
        formValues: mockFormValues,
      });
    });

    it("should delete validation errors from session if been supplied them", () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2, value2: 3 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;
      showVatIndicatorPage(req, res);

      expect(req.session.formError).toBeUndefined();
      expect(req.session.formValues).toBeUndefined();
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
      validateSession.mockImplementation(() => {
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
        data: {},
      },
      body: body,
    };
    let res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    beforeEach(() => {
      validateVatIndicator.mockReturnValue({});
      body.vatIndicator = "yes";
    });

    it.each([
      ["yes", true],
      ["no", false],
    ])(
      "should redirect to result page if value is valid",
      (enteredValue, expectedValue) => {
        body.vatIndicator = enteredValue;
        getNextPage.mockReturnValue("nextPage");

        postVatIndicatorRate(req, res);

        expect(res.redirect).toHaveBeenCalledWith("nextPage");
        expect(req.session.data.vatIndicator).toEqual(expectedValue);

        expect(getNextPage).toHaveBeenCalledWith(
          URL_VatIndicator,
          req.session.data,
        );
      },
    );

    it("render error page when value is invalid", async () => {
      const mockError = {
        list: [{ error: "error" }],
      };
      validateVatIndicator.mockReturnValue(mockError);
      postVatIndicatorRate(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_VatIndicator);
      expect(req.session.formError).toEqual(mockError);
      expect(req.session.formValues).toEqual({
        vatIndicator: "yes",
      });
      expect(sessionData.vatIndicator).toBeUndefined();
    });
  });
});
