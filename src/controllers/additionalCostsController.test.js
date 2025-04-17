import {
  postAdditionalCostsPage,
  showAdditionalCostsPage,
} from "./additionalCostsController";
import {
  feeTypes,
  getFeeDetails,
  getDisplayableFees,
} from "../service/feeDetailsService";
import { getSessionData } from "../service/sessionDataService";
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
      getFeeDetails.mockReturnValue(feeDetails);
      getCaseStageForImmigration.mockReturnValue("_IMM01");
      getSessionData.mockReturnValue({});
      getDisplayableFees.mockReturnValue(displayableFees);

      req.session.data.lawCategory = immigrationLaw;

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render additional costs page", async () => {
      await showAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/additionalCosts", {
        fieldsToShow: displayableFees,
        csrfToken: "mocked-csrf-token",
        feeTypes: feeTypes,
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
      getSessionData.mockImplementation(() => {
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

    it("render error page when validation fails", async () => {
      validateAndReturnAdditionalCostValue
        .mockReset()
        .mockReturnValueOnce("2")
        .mockImplementation(() => {
          throw new Error("Validation failed");
        });

      await postAdditionalCostsPage(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
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
