import { getCaseStages, isValidCaseStage } from "./caseStageService";

const expectedCaseStages = [
  {
    caseStage: "FAMA",
    description: "Divorce",
  },
  {
    caseStage: "FAMB",
    description: "Dissolution",
  },
];

const caseStageAPIResponse = {
  data: {
    caseStages: expectedCaseStages,
  },
};

describe("getCaseStages", () => {
  let req = {
    axiosMiddleware: {
      get: jest.fn(),
    },
    session: {
      data: {},
    },
  };

  beforeEach(() => {
    req.session.data = {
      matterCode1: "FAMA",
      matterCode2: "FPET",
    };
  });

  it("should return case stages from service if not been cached already", async () => {
    req.axiosMiddleware.get.mockResolvedValue(caseStageAPIResponse);

    const returnedCaseStages = await getCaseStages(req);
    expect(returnedCaseStages).toEqual(expectedCaseStages);
    expect(req.session.data.validCaseStages).toEqual(expectedCaseStages);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages/", {
      data: {
        matterCode1: "FAMA",
        matterCode2: "FPET",
      },
    });
  });

  it("should return case stages from session if have been cached", async () => {
    req.session.data = {
      matterCode1: "FAMA",
      matterCode2: "FPET",
      validCaseStages: expectedCaseStages,
    };

    const returnedCaseStages = await getCaseStages(req);
    expect(returnedCaseStages).toEqual(expectedCaseStages);
    expect(req.session.data.validCaseStages).toEqual(expectedCaseStages);
    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should let the error propogate if axios errors", async () => {
    req.axiosMiddleware.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() => getCaseStages(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages/", {
      data: {
        matterCode1: "FAMA",
        matterCode2: "FPET",
      },
    });
  });
});

describe("isValidCaseStages", () => {
  it("should return true if valid caseStage", () => {
    expect(isValidCaseStage(expectedCaseStages, "FAMA")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidCaseStage(expectedCaseStages, "FBMA")).toEqual(false);
  });
});
