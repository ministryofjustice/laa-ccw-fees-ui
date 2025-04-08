import {
  getCaseStageForImmigration,
  getCaseStages,
  isValidCaseStage,
} from "./caseStageService";

const fama = "FAMA";
const fpet = "FPET";

describe("getCaseStages", () => {
  const expectedCaseStages = [
    {
      caseStage: "CS1",
      description: "Divorce",
    },
    {
      caseStage: "CS2",
      description: "Dissolution",
    },
  ];

  const caseStageAPIResponse = {
    data: {
      caseStages: expectedCaseStages,
    },
  };

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
      matterCode1: fama,
      matterCode2: fpet,
    };
  });

  it("should return case stages from service if not been cached already", async () => {
    req.axiosMiddleware.get.mockResolvedValue(caseStageAPIResponse);

    const returnedCaseStages = await getCaseStages(req);
    expect(returnedCaseStages).toEqual(expectedCaseStages);
    expect(req.session.data.validCaseStages).toEqual(expectedCaseStages);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages", {
      data: {
        matterCode1: fama,
        matterCode2: fpet,
      },
    });
  });

  it("should return case stages from session if have been cached", async () => {
    req.session.data = {
      matterCode1: fama,
      matterCode2: fpet,
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

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages", {
      data: {
        matterCode1: fama,
        matterCode2: fpet,
      },
    });
  });
});

describe("getCaseStageForImmigration", () => {
  const expectedCaseStages = [
    {
      caseStage: "_IMM01",
      description: "Fees",
    },
  ];

  const caseStageAPIResponse = {
    data: {
      caseStages: expectedCaseStages,
    },
  };

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
      matterCode1: fama,
      matterCode2: fpet,
    };
  });

  it("should set the case stage to the default value", async () => {
    req.axiosMiddleware.get.mockResolvedValue(caseStageAPIResponse);

    const returnedCaseStage = await getCaseStageForImmigration(req);
    expect(returnedCaseStage).toEqual("_IMM01");
    expect(req.session.data.validCaseStages).toEqual(expectedCaseStages);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages", {
      data: {
        matterCode1: fama,
        matterCode2: fpet,
      },
    });
  });

  it("should return case stage from session if have been cached", async () => {
    req.session.data = {
      matterCode1: fama,
      matterCode2: fpet,
      validCaseStages: expectedCaseStages,
    };

    const returnedCaseStage = await getCaseStageForImmigration(req);
    expect(returnedCaseStage).toEqual("_IMM01");
    expect(req.session.data.validCaseStages).toEqual(expectedCaseStages);
    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should let the error propogate if axios errors", async () => {
    req.axiosMiddleware.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() => getCaseStageForImmigration(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages", {
      data: {
        matterCode1: fama,
        matterCode2: fpet,
      },
    });
  });

  it("should error if unexpected amount of case stages returned (expect one for immigration)", async () => {
    req.axiosMiddleware.get.mockResolvedValue({
      data: {
        caseStages: [
          {
            caseStage: "_IMM01",
            description: "Fees",
          },
          {
            caseStage: "_IMM02",
            description: "Fees2",
          },
        ],
      },
    });

    await expect(() => getCaseStageForImmigration(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/case-stages", {
      data: {
        matterCode1: fama,
        matterCode2: fpet,
      },
    });
  });
});

describe("isValidCaseStages", () => {
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
  it("should return true if valid caseStage", () => {
    expect(isValidCaseStage(expectedCaseStages, "FAMA")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidCaseStage(expectedCaseStages, "FBMA")).toEqual(false);
  });
});
