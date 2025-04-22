import { validateSession } from "../service/sessionDataService";
import {
  getLondonRates,
  isValidLondonRate,
} from "../service/londonRateService";
import { postLondonRatePage, showLondonRatePage } from "./londonRateController";
import { getNextPage, URL_LondonRate } from "../routes/navigator";
import { validateLondonRate } from "./validations/londonRateValidator";

jest.mock("../service/londonRateService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");
jest.mock("./validations/londonRateValidator");

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

describe("londonRateController", () => {
  describe("showLondonRatePage", () => {
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
      getLondonRates.mockReturnValue(londonRates);
      validateSession.mockReturnValue(true);

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render claim start page", () => {
      showLondonRatePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/londonRate", {
        rates: londonRates,
        csrfToken: "mocked-csrf-token",
        errors: {},
        formValues: {},
      });
    });

    it("should pre-populate saved data", () => {
      req.session.data.londonRate = london;
      showLondonRatePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/londonRate", {
        rates: londonRates,
        csrfToken: "mocked-csrf-token",
        errors: {},
        formValues: {
          londonRate: london,
        },
      });
    });

    it("should show validation errors if defined", () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      showLondonRatePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/londonRate", {
        rates: londonRates,
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
      showLondonRatePage(req, res);

      expect(req.session.formError).toBeUndefined();
      expect(req.session.formValues).toBeUndefined();
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
      validateSession.mockImplementation(() => {
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
      validateLondonRate.mockReturnValue({});
      body.londonRate = london;
      req.session.data = {};
    });

    it("should redirect to result page if valid form data is supplied", () => {
      getNextPage.mockReturnValue("nextPage");

      postLondonRatePage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(req.session.data.londonRate).toEqual(london);

      expect(validateLondonRate).toHaveBeenCalledWith(london);
      expect(getNextPage).toHaveBeenCalledWith(
        URL_LondonRate,
        req.session.data,
      );
    });

    it("set validation errors and redirect to the GET to display them", async () => {
      const mockError = {
        list: [{ error: "error" }],
      };
      validateLondonRate.mockReturnValue(mockError);
      getLondonRates.mockReturnValue(londonRates);

      postLondonRatePage(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_LondonRate);
      expect(req.session.formError).toEqual(mockError);
      expect(req.session.formValues).toEqual({
        londonRate: london,
      });
      expect(req.session.data.londonRate).toBeUndefined();
    });
  });
});
