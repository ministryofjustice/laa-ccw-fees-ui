import { postCaseStagePage, showCaseStagePage } from "./caseStageController";
import { getCaseStages, isValidCaseStage } from "../service/caseStageService";
import { validateSession } from "../service/sessionDataService";
import { getNextPage, URL_CaseStage } from "../routes/navigator";
import { validateCaseStage } from "./validations/caseStageValidator";

jest.mock("../service/caseStageService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");
jest.mock("./validations/caseStageValidator");

const caseStages = [
  {
    caseStage: "LVL1",
    description: "Level 1",
  },
  {
    caseStage: "LVL2",
    description: "Level 2",
  },
];
const level1 = "LVL1";

describe("caseStageController", () => {
  describe("showCaseStagePage", () => {
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
      getCaseStages.mockReturnValue(caseStages);
      validateSession.mockReturnValue(true);

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render case stage page", async () => {
      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/caseStage", {
        caseStages: caseStages,
        csrfToken: "mocked-csrf-token",
        errors: {},
        formValues: {},
      });
      expect(getCaseStages).toHaveBeenCalledWith(req);
    });

    it("should pre-populate the value if already set in session data", async () => {
      req.session.data.caseStage = level1;
      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/caseStage", {
        caseStages: caseStages,
        csrfToken: "mocked-csrf-token",
        errors: {},
        formValues: {
          caseStage: level1,
        },
      });
      expect(getCaseStages).toHaveBeenCalledWith(req);
    });

    it("should display validation errors if set", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/caseStage", {
        caseStages: caseStages,
        csrfToken: "mocked-csrf-token",
        errors: mockError,
        formValues: mockFormValues,
      });
      expect(getCaseStages).toHaveBeenCalledWith(req);
    });

    it("should render error page if fails to load page", async () => {
      req.csrfToken.mockImplementation(() => {
        throw new Error("token problems");
      });

      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if no existing session data already (as skipped workflow)", async () => {
      validateSession.mockImplementation(() => {
        throw new Error("No session data found");
      });

      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if getCaseStages call throws error", async () => {
      getCaseStages.mockImplementation(() => {
        throw new Error("API error");
      });

      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });

      expect(getCaseStages).toHaveBeenCalledWith(req);
    });
  });

  describe("postCaseStagePage", () => {
    let req = {};
    let res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    beforeEach(() => {
      getCaseStages.mockResolvedValue(caseStages);
      validateCaseStage.mockReturnValue({});

      req = {
        session: {
          data: {},
        },
        body: {
          caseStage: level1,
        },
      };
    });

    it("should redirect to next page if valid form data is supplied", async () => {
      getNextPage.mockReturnValue("nextPage");

      await postCaseStagePage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(req.session.data.caseStage).toEqual(level1);
      expect(getNextPage).toHaveBeenCalledWith(URL_CaseStage, req.session.data);
      expect(validateCaseStage).toHaveBeenCalledWith(caseStages, level1);
      expect(getCaseStages).toHaveBeenCalledWith(req);
    });

    it("should go back to the GET to display any validation errors", async () => {
      const mockError = {
        list: [{ error: "error" }],
      };
      validateCaseStage.mockReturnValue(mockError);

      await postCaseStagePage(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_CaseStage);
      expect(req.session.formError).toEqual(mockError);
      expect(req.session.formValues).toEqual({
        caseStage: level1,
      });
      expect(req.session.data.caseStage).toBeUndefined();
      expect(getNextPage).toHaveBeenCalledTimes(0);
      expect(validateCaseStage).toHaveBeenCalledWith(caseStages, level1);
      expect(getCaseStages).toHaveBeenCalledWith(req);
    });

    it("should render error page if getCaseStages call throws error", async () => {
      getCaseStages.mockImplementation(() => {
        throw new Error("API error");
      });

      await postCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(getCaseStages).toHaveBeenCalledWith(req);
    });
  });
});
