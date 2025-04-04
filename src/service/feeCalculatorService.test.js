import { getCalculationResult } from "./feeCalculatorService";

describe("getCalculationResult", () => {
  const axios = {
    get: jest.fn(),
  };

  it("should return data from api if successful call", async () => {
    const sessionData = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      londonRate: "LDN",
      caseStage: "FPL01",
      vatIndicator: false,
      startDate: "03/04/2025",
    };

    const expectedRequestBody = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      locationCode: "LDN",
      caseStage: "FPL01",
    };

    axios.get.mockResolvedValue({
      data: {
        matterCode1: "FAML",
        matterCode2: "FPET",
        locationCode: "LDN",
        caseStage: "FPL01",
        amount: 120,
        total: 144,
        vat: 24,
      },
    });

    const result = await getCalculationResult(sessionData, axios);

    expect(result).toEqual({
      amount: 120,
      total: 144,
      vat: 24,
    });

    expect(axios.get).toHaveBeenCalledWith("/fees/calculate", {
      data: expectedRequestBody,
    });
  });

  it("should throw error if no matterCode1 in session data", async () => {
    const sessionData = {
      matterCode2: "FPET",
      londonRate: "LDN",
      caseStage: "FPL01",
      vatIndicator: false,
      startDate: "03/04/2025",
    };

    await expect(() =>
      getCalculationResult(sessionData, axios),
    ).rejects.toThrow(Error);

    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no matterCode2 in session data", async () => {
    const sessionData = {
      matterCode1: "FAML",
      londonRate: "LDN",
      caseStage: "FPL01",
      vatIndicator: false,
      startDate: "03/04/2025",
    };

    await expect(() =>
      getCalculationResult(sessionData, axios),
    ).rejects.toThrow(Error);

    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no londonRate in session data", async () => {
    const sessionData = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      caseStage: "FPL01",
      vatIndicator: false,
      startDate: "03/04/2025",
    };

    await expect(() =>
      getCalculationResult(sessionData, axios),
    ).rejects.toThrow(Error);

    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no caseStage in session data", async () => {
    const sessionData = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      londonRate: "LDN",
      vatIndicator: false,
      startDate: "03/04/2025",
    };

    await expect(() =>
      getCalculationResult(sessionData, axios),
    ).rejects.toThrow(Error);

    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if api call fails", async () => {
    const sessionData = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      londonRate: "LDN",
      caseStage: "FPL01",
      vatIndicator: false,
      startDate: "03/04/2025",
    };

    const expectedRequestBody = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      locationCode: "LDN",
      caseStage: "FPL01",
    };

    axios.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() =>
      getCalculationResult(sessionData, axios),
    ).rejects.toThrow(Error);

    expect(axios.get).toHaveBeenCalledWith("/fees/calculate", {
      data: expectedRequestBody,
    });
  });
});
