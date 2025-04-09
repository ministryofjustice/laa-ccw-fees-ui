import {
  postAdditionalCostsPage,
  showAdditionalCostsPage,
} from "./additionalCostsController";
import {
  feeType_Automatic,
  feeType_OptionalBool,
  feeType_OptionalFee,
  feeType_OptionalUnit,
  getAdditionalFees,
  getDisplayableFees,
  isValidFeeEntered,
  isValidUnitEntered,
} from "../service/additionalFeeService";
import { getSessionData } from "../service/sessionDataService";
import { getNextPage, URL_AdditionalCosts } from "../routes/navigator";
import { familyLaw, immigrationLaw } from "../service/lawCategoryService";
import { getCaseStageForImmigration } from "../service/caseStageService";

jest.mock("../service/additionalFeeService");
jest.mock("../service/caseStageService");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");

const additionalFees = [
  {
    levelCode: "LVL1",
    description: "Level 1",
    type: feeType_OptionalUnit,
  },
  {
    levelCode: "LVL2",
    description: "Level 2",
    type: feeType_Automatic,
  },
  {
    levelCode: "LVL3",
    description: "Level 3",
    type: feeType_OptionalBool,
  },
  {
    levelCode: "LVL4",
    description: "Level 4",
    type: feeType_OptionalFee,
  },
  {
    levelCode: "LVL5",
    description: "Level 5",
    type: feeType_OptionalUnit,
  },
  {
    levelCode: "LVL6",
    description: "Level 6",
    type: feeType_Automatic,
  },
];

const additionalFeesFiltered = [
  {
    levelCode: "LVL1",
    description: "Level 1",
    type: feeType_OptionalUnit,
  },
  {
    levelCode: "LVL4",
    description: "Level 4",
    type: feeType_OptionalFee,
  },
  {
    levelCode: "LVL5",
    description: "Level 5",
    type: feeType_OptionalUnit,
  },
];

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
    getAdditionalFees.mockReturnValue(additionalFees);
    getCaseStageForImmigration.mockReturnValue("_IMM01");
    getSessionData.mockReturnValue({});
    getDisplayableFees.mockReturnValue(additionalFeesFiltered);

    req.session.data.lawCategory = immigrationLaw;

    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render additional costs page", async () => {
    await showAdditionalCostsPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/additionalCosts", {
      fieldsToShow: [
        {
          levelCode: "LVL1",
          description: "Level 1",
          type: feeType_OptionalUnit,
        },
        {
          levelCode: "LVL4",
          description: "Level 4",
          type: feeType_OptionalFee,
        },
        {
          levelCode: "LVL5",
          description: "Level 5",
          type: feeType_OptionalUnit,
        },
      ],
      csrfToken: "mocked-csrf-token",
    });
    expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
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

  it("should render error page if getAdditionalFees call throws error", async () => {
    getAdditionalFees.mockImplementation(() => {
      throw new Error("API error");
    });

    await showAdditionalCostsPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });

    expect(getAdditionalFees).toHaveBeenCalledWith(req);
  });

  it("should redirect to the next page if not immigration law", async () => {
    getNextPage.mockReturnValue("nextPage");
    req.session.data.lawCategory = familyLaw;

    await showAdditionalCostsPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(res.render).toHaveBeenCalledTimes(0);
    expect(getCaseStageForImmigration).toHaveBeenCalledTimes(0);
    expect(getAdditionalFees).toHaveBeenCalledTimes(0);
    expect(getNextPage).toHaveBeenCalledWith(URL_AdditionalCosts);
  });

  it("should redirect to the next page if no additional fees", async () => {
    getNextPage.mockReturnValue("nextPage");

    getAdditionalFees.mockReturnValue([]);
    getDisplayableFees.mockReturnValue([]);

    await showAdditionalCostsPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(res.render).toHaveBeenCalledTimes(0);
    expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
    expect(getNextPage).toHaveBeenCalledWith(URL_AdditionalCosts);
  });

  it("should redirect to the next page if no additional fees can be shown", async () => {
    getNextPage.mockReturnValue("nextPage");

    getAdditionalFees.mockReturnValue([
      {
        levelCode: "LVL2",
        description: "Level 2",
        type: feeType_Automatic,
      },
    ]);
    getDisplayableFees.mockReturnValue([]);

    await showAdditionalCostsPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(res.render).toHaveBeenCalledTimes(0);
    expect(getCaseStageForImmigration).toHaveBeenCalledWith(req);
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
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
    getAdditionalFees.mockResolvedValue(additionalFees);
    getDisplayableFees.mockReturnValue(additionalFeesFiltered);
    
    isValidUnitEntered.mockReturnValue(true);
    isValidFeeEntered.mockReturnValue(true);

    req = {
      session: {
        data: {},
      },
      body: {
        LVL1: "2",
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
      { levelCode: "LVL4", value: "2.34" },
      { levelCode: "LVL5", value: "5" },
    ]);
    expect(getNextPage).toHaveBeenCalledWith(
      URL_AdditionalCosts,
      req.session.data,
    );
    expect(isValidUnitEntered).toHaveBeenNthCalledWith(1, "2");
    expect(isValidUnitEntered).toHaveBeenNthCalledWith(2, "5");
    expect(isValidFeeEntered).toHaveBeenCalledWith("2.34")
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
  });

  it("should allow empty for fee field and convert it to 0", async () => {
    getNextPage.mockReturnValue("nextPage");
    req.body.LVL4 = "";

    await postAdditionalCostsPage(req, res);

    expect(res.redirect).toHaveBeenCalledWith("nextPage");
    expect(req.session.data.additionalCosts).toEqual([
      { levelCode: "LVL1", value: "2" },
      { levelCode: "LVL4", value: "0" },
      { levelCode: "LVL5", value: "5" },
    ]);
    expect(getNextPage).toHaveBeenCalledWith(
      URL_AdditionalCosts,
      req.session.data,
    );
    expect(isValidUnitEntered).toHaveBeenNthCalledWith(1, "2");
    expect(isValidUnitEntered).toHaveBeenNthCalledWith(2, "5");
    expect(isValidFeeEntered).toHaveBeenCalledTimes(0)
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
  });


  it("render error page when expected value from form is missing", async () => {
    req.body.LVL5 = null;

    await postAdditionalCostsPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });
    expect(req.session.data.additionalCosts).toBeUndefined();
  });

  it("render error page when entered value is invalid for unit field", async () => {
    isValidUnitEntered.mockReturnValueOnce(true);
    isValidUnitEntered.mockReturnValueOnce(false);

    await postAdditionalCostsPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(req.session.data.additionalCosts).toBeUndefined();
    expect(isValidUnitEntered).toHaveBeenNthCalledWith(1, "2");
    expect(isValidUnitEntered).toHaveBeenNthCalledWith(2, "5");
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
  });

  it("render error page when entered value is invalid for fee field", async () => {
    isValidFeeEntered.mockReturnValue(false);

    await postAdditionalCostsPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(req.session.data.additionalCosts).toBeUndefined();
    expect(isValidUnitEntered).toHaveBeenCalledWith("2");
    expect(isValidFeeEntered).toHaveBeenCalledWith("2.34")
    expect(getAdditionalFees).toHaveBeenCalledWith(req);
  });


  it("should render error page if getAdditionalFees call throws error", async () => {
    getAdditionalFees.mockImplementation(() => {
      throw new Error("API error");
    });

    await postAdditionalCostsPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred saving the answer.",
      status: "An error occurred",
    });

    expect(getAdditionalFees).toHaveBeenCalledWith(req);
  });
});
