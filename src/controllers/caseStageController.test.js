import { postCaseStagePage, showCaseStagePage } from "./caseStageController";
import { getCaseStages, isValidCaseStage } from "../service/caseStageService";
import { getSessionData } from "../service/sessionDataService";
import { getNextPage, URL_CaseStage } from "../routes/navigator";

jest.mock("../service/caseStageService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

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
    };
    let res = {
      render: jest.fn(),
    };

    beforeEach(() => {
      getCaseStages.mockReturnValue(caseStages);
      getSessionData.mockReturnValue({});

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render case stage page", async () => {
      await showCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/caseStage", {
        caseStages: caseStages,
        csrfToken: "mocked-csrf-token",
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
      getSessionData.mockImplementation(() => {
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
      isValidCaseStage.mockReturnValue(true);

      req = {
        session: {
          data: {},
        },
        body: {
          caseStage: level1,
        },
      };
    });

    it("should redirect to result page if valid form data is supplied", async () => {
      getNextPage.mockReturnValue("nextPage");

      await postCaseStagePage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(req.session.data.caseStage).toEqual(level1);
      expect(getNextPage).toHaveBeenCalledWith(URL_CaseStage, req.session.data);
      expect(isValidCaseStage).toHaveBeenCalledWith(caseStages, level1);
      expect(getCaseStages).toHaveBeenCalledWith(req);
    });

    it("render error page when case stage from form is missing", async () => {
      req.body.caseStage = null;

      await postCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/caseStage", {
        caseStages: [
          {
            caseStage: "LVL1",
            description: "Level 1",
          },
          {
            caseStage: "LVL2",
            description: "Level 2",
          },
        ],
        errors: {
          list: [
            {
              href: "#caseStage",
              text: "'Case Stage / Level' not entered",
            },
          ],
          messages: {
            caseStage: {
              text: "'Case Stage / Level' not entered",
            },
          },
        },
        formValues: {
          caseStage: null,
        },
      });
      expect(req.session.data.caseStage).toBeUndefined();
    });

    it("render error page when case stage is invalid", async () => {
      isValidCaseStage.mockReturnValue(false);

      await postCaseStagePage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/caseStage", {
        caseStages: [
          {
            caseStage: "LVL1",
            description: "Level 1",
          },
          {
            caseStage: "LVL2",
            description: "Level 2",
          },
        ],
        errors: {
          list: [
            {
              href: "#caseStage",
              text: "'Case Stage / Level' is not valid",
            },
          ],
          messages: {
            caseStage: {
              text: "'Case Stage / Level' is not valid",
            },
          },
        },
        formValues: {
          caseStage: "LVL1",
        },
      });

      expect(req.session.data.caseStage).toBeUndefined();
      expect(isValidCaseStage).toHaveBeenCalledWith(caseStages, level1);
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
