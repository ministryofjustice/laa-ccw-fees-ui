import {
  postAdditionalCostsPage,
  showAdditionalCostsPage,
} from "./additionalCostsController";
import {
  feeTypes,
  getFeeDetails,
  getDisplayableFees,
} from "../service/feeDetailsService";
import { validateSession } from "../service/sessionDataService";
import { getNextPage, URL_AdditionalCosts } from "../routes/navigator";
import { familyLaw, immigrationLaw } from "../service/lawCategoryService";
import { getCaseStageForImmigration } from "../service/caseStageService";
import { validateAndReturnAdditionalCostValue } from "./validations/additionalCostValidator";

jest.mock("./validations/additionalCostValidator");
jest.mock("../service/feeDetailsService");
jest.mock("../service/caseStageService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

const lvl1 = {
  levelCode: "LVL1",
  description: "Level 1",
  levelCodeType: feeTypes.optionalUnit,
};
const lvl2 = {
  levelCode: "LVL2",
  description: "Level 2",
  levelCodeType: feeTypes.automatic,
};
const lvl3 = {
  levelCode: "LVL3",
  description: "Level 3",
  levelCodeType: feeTypes.optionalBool,
};
const lvl4 = {
  levelCode: "LVL4",
  description: "Level 4",
  levelCodeType: feeTypes.optionalFee,
};
const lvl5 = {
  levelCode: "LVL5",
  description: "Level 5",
  levelCodeType: feeTypes.optionalUnit,
};
const lvl6 = {
  levelCode: "LVL6",
  description: "Level 6",
  levelCodeType: feeTypes.automatic,
};

const feeDetails = [lvl1, lvl2, lvl3, lvl4, lvl5, lvl6];

const displayableFees = [lvl1, lvl3, lvl4, lvl5];

describe("additionalCostsController", () => {
  describe("showAdditionalCostsPage", () => {
    let req = {
      csrfToken: jest.fn(),
      session: {
        data: {},
      },
    };
    let res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    beforeEach(() => {
      getFeeDetails.mockResolvedValue(feeDetails);
      getCaseStageForImmigration.mockResolvedValue("_IMM01");
      validateSession.mockReturnValue(true);
      req.session.data.lawCategory = immigrationLaw;
      getDisplayableFees.mockReturnValue(displayableFees);

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render additional costs page", async () => {
      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/additionalCosts", {
        fieldsToShow: displayableFees,
        csrfToken: "mocked-csrf-token",
        feeTypes: feeTypes,
        errors: {},
        formValues: {},
      });
      expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
      expect(getFeeDetails).toHaveBeenCalledWith(req);
    });

    it("should render page with validation errors if session has errors in", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2, value2: 3 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/additionalCosts", {
        fieldsToShow: displayableFees,
        csrfToken: "mocked-csrf-token",
        feeTypes: feeTypes,
        errors: mockError,
        formValues: mockFormValues,
      });
      expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
      expect(getFeeDetails).toHaveBeenCalledWith(req);
    });

    it("should delete validation errors from session if been supplied them", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2, value2: 3 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;
      console.log(req.session.formError);

      await showAdditionalCostsPage(req, res);
      console.log(req.session.formError);

      expect(req.session.formError).toBeUndefined();
      console.log(req.session.formError);

      expect(req.session.formValues).toBeUndefined();
    });

    it("should populate existing additional costs from session data if set", async () => {
      req.session.data.additionalCosts = [
        { levelCode: "LVL1", value: "2" },
        { levelCode: "LVL3", value: true },
        { levelCode: "LVL4", value: "2.34" },
        { levelCode: "LVL5", value: "5" },
      ];

      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/additionalCosts", {
        fieldsToShow: displayableFees,
        csrfToken: "mocked-csrf-token",
        feeTypes: feeTypes,
        errors: {},
        formValues: {
          LVL1: "2",
          LVL3: true,
          LVL4: "2.34",
          LVL5: "5",
        },
      });
      expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
      expect(getFeeDetails).toHaveBeenCalledWith(req);
    });

    it("should render error page if fails to load page", async () => {
      req.csrfToken.mockImplementation(() => {
        throw new Error("token problems");
      });

      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if no existing session data already (as skipped workflow)", async () => {
      validateSession.mockImplementation(() => {
        throw new Error("No session data found");
      });

      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if getCaseStages call throws error", async () => {
      getCaseStageForImmigration.mockImplementation(() => {
        throw new Error("API error");
      });

      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });

      expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
    });

    it("should render error page if getFeeDetails call throws error", async () => {
      getFeeDetails.mockImplementation(() => {
        throw new Error("API error");
      });

      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });

      expect(getFeeDetails).toHaveBeenCalledWith(req);
    });

    it("should redirect to the next page if not immigration law", async () => {
      getNextPage.mockReturnValue("nextPage");
      req.session.data.lawCategory = familyLaw;

      await showAdditionalCostsPage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(res.render).toHaveBeenCalledTimes(0);
      expect(getCaseStageForImmigration).toHaveBeenCalledTimes(0);
      expect(getFeeDetails).toHaveBeenCalledTimes(0);
      expect(getNextPage).toHaveBeenCalledWith(URL_AdditionalCosts);
    });

    it("should redirect to the next page if no additional fees", async () => {
      getNextPage.mockReturnValue("nextPage");

      getFeeDetails.mockReturnValue([]);
      getDisplayableFees.mockReturnValue([]);

      await showAdditionalCostsPage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(res.render).toHaveBeenCalledTimes(0);
      expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
      expect(getFeeDetails).toHaveBeenCalledWith(req);
      expect(getNextPage).toHaveBeenCalledWith(URL_AdditionalCosts);
    });

    it("should redirect to the next page if no additional fees can be shown", async () => {
      getNextPage.mockReturnValue("nextPage");

      getFeeDetails.mockReturnValue(feeDetails);
      getDisplayableFees.mockReturnValue([]);

      await showAdditionalCostsPage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(res.render).toHaveBeenCalledTimes(0);
      expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
      expect(getFeeDetails).toHaveBeenCalledWith(req);
      expect(getNextPage).toHaveBeenCalledWith(URL_AdditionalCosts);
    });
  });

  describe("postAdditionalCostsPage", () => {
    let req = {};
    let res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    beforeEach(() => {
      getFeeDetails.mockResolvedValue(feeDetails);
      getDisplayableFees.mockReturnValue(displayableFees);

      validateAndReturnAdditionalCostValue.mockReturnValueOnce({ value: "2" });
      validateAndReturnAdditionalCostValue.mockReturnValueOnce({ value: true });
      validateAndReturnAdditionalCostValue.mockReturnValueOnce({
        value: "2.34",
      });
      validateAndReturnAdditionalCostValue.mockReturnValueOnce({ value: "5" });

      req = {
        session: {
          data: {},
        },
        body: {
          LVL1: "2",
          LVL3: "yes",
          LVL4: "2.34",
          LVL5: "5",
        },
      };
    });

    it("should redirect to result page if valid form data is supplied", async () => {
      getNextPage.mockReturnValue("nextPage");

      await postAdditionalCostsPage(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(req.session.data.additionalCosts).toEqual([
        { levelCode: "LVL1", value: "2" },
        { levelCode: "LVL3", value: true },
        { levelCode: "LVL4", value: "2.34" },
        { levelCode: "LVL5", value: "5" },
      ]);
      expect(getNextPage).toHaveBeenCalledWith(
        URL_AdditionalCosts,
        req.session.data,
      );

      expect(validateAndReturnAdditionalCostValue).toHaveBeenNthCalledWith(
        1,
        "2",
        lvl1,
      );
      expect(validateAndReturnAdditionalCostValue).toHaveBeenNthCalledWith(
        2,
        "yes",
        lvl3,
      );
      expect(validateAndReturnAdditionalCostValue).toHaveBeenNthCalledWith(
        3,
        "2.34",
        lvl4,
      );
      expect(validateAndReturnAdditionalCostValue).toHaveBeenNthCalledWith(
        4,
        "5",
        lvl5,
      );
      expect(getFeeDetails).toHaveBeenCalledWith(req);
    });

    it("redirect to the get so it can display validation errors if there are some", async () => {
      validateAndReturnAdditionalCostValue
        .mockReset()
        .mockReturnValueOnce({ value: "2" })
        .mockReturnValueOnce({ error: "Error" })
        .mockReturnValueOnce({ value: "3" })
        .mockReturnValueOnce({ error: "Error" });

      await postAdditionalCostsPage(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_AdditionalCosts);
      expect(req.session.formError).toEqual({
        list: [
          { href: "#LVL3", text: "'Level 3' Error" },
          { href: "#LVL5", text: "'Level 5' Error" },
        ],
        messages: {
          LVL3: { text: "'Level 3' Error" },
          LVL5: { text: "'Level 5' Error" },
        },
      });
      expect(req.session.formValues).toEqual({
        LVL1: "2",
        LVL3: undefined,
        LVL4: "3",
        LVL5: undefined,
      });
      expect(req.session.data.additionalCosts).toBeUndefined();
    });

    it("should render error page if getFeeDetails call throws error", async () => {
      getFeeDetails.mockImplementation(() => {
        throw new Error("API error");
      });

      await postAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(getFeeDetails).toHaveBeenCalledWith(req);
    });
  });
});
