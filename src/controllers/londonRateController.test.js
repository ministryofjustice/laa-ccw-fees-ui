import { validateSession } from "../service/sessionDataService";
import {
  getLondonRates,
  isValidLondonRate,
} from "../service/londonRateService";
import { postLondonRatePage, showLondonRatePage } from "./londonRateController";
import { getNextPage, URL_LondonRate } from "../routes/navigator";

jest.mock("../service/londonRateService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

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
      getNextPage.mockReturnValue("nextPage");

      postLondonRatePage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(sessionData.londonRate).toEqual(london);

      expect(isValidLondonRate).toHaveBeenCalledWith(london);
      expect(getNextPage).toHaveBeenCalledWith(
        URL_LondonRate,
        req.session.data,
      );
    });

    it("render error page when London Rate from form is missing", async () => {
      body.londonRate = null;
      getLondonRates.mockReturnValue(londonRates);

      postLondonRatePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/londonRate", {
        errors: {
          list: [
            {
              href: "#londonRate",
              text: "'London/Non-London Rate' not entered",
            },
          ],
          messages: {
            londonRate: {
              text: "'London/Non-London Rate' not entered",
            },
          },
        },
        formValues: {
          londonRate: null,
        },
        rates: [
          {
            description: "London",
            id: "LDN",
          },
          {
            description: "Non-London",
            id: "NLDN",
          },
        ],
      });
      expect(sessionData.londonRate).toBeUndefined();
    });

    it("render error page when London Rate is invalid", async () => {
      getLondonRates.mockReturnValue(londonRates);
      isValidLondonRate.mockReturnValue(false);

      postLondonRatePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/londonRate", {
        errors: {
          list: [
            {
              href: "#londonRate",
              text: "'London/Non-London Rate' is not valid",
            },
          ],
          messages: {
            londonRate: {
              text: "'London/Non-London Rate' is not valid",
            },
          },
        },
        formValues: {
          londonRate: "LDN",
        },
        rates: [
          {
            description: "London",
            id: "LDN",
          },
          {
            description: "Non-London",
            id: "NLDN",
          },
        ],
      });

      expect(sessionData.londonRate).toBeUndefined();
      expect(isValidLondonRate).toHaveBeenCalledWith(london);
    });
  });
});
