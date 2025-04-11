import { feeTypes } from "./additionalFeeService";
import { getCalculationResult } from "./feeCalculatorService";
import { familyLaw, immigrationLaw } from "./lawCategoryService";
import { notApplicable } from "./londonRateService";

const additionalFees = [
  {
    levelCode: "LVL1",
    type: feeTypes.optionalUnit,
  },
  {
    levelCode: "LVL2",
    type: feeTypes.automatic,
  },
  {
    levelCode: "LVL3",
    type: feeTypes.optionalUnit,
  },
  {
    levelCode: "LVL4",
    type: feeTypes.optionalFee,
  },
  { levelCode: "LVL5", type: feeTypes.optionalBool },
  { levelCode: "LVL6", type: feeTypes.optionalBool },
];

describe("getCalculationResult", () => {
  const axios = {
    get: jest.fn(),
  };

  describe("For family law", () => {
    it("should return data from api if successful call", async () => {
      const sessionData = {
        matterCode1: "FAML",
        matterCode2: "FPET",
        londonRate: "LDN",
        caseStage: "FPL01",
        vatIndicator: false,
        startDate: "03/04/2025",
        lawCategory: familyLaw,
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
        lawCategory: familyLaw,
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
        lawCategory: familyLaw,
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
        lawCategory: familyLaw,
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
        lawCategory: familyLaw,
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
        lawCategory: familyLaw,
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

  describe("For immigration law", () => {
    it.each([null, []])(
      "should return data from api if successful call with no additional costs",
      async (additionalCosts) => {
        const sessionData = {
          matterCode1: "FAML",
          matterCode2: "FPET",
          vatIndicator: false,
          startDate: "03/04/2025",
          lawCategory: immigrationLaw,
          caseStage: "_IMM01",
          validAdditionalFees: additionalCosts,
        };

        const expectedRequestBody = {
          matterCode1: "FAML",
          matterCode2: "FPET",
          locationCode: notApplicable,
          caseStage: "_IMM01",
          levelCodes: [],
        };

        axios.get.mockResolvedValue({
          data: {
            matterCode1: "FAML",
            matterCode2: "FPET",
            locationCode: notApplicable,
            caseStage: "_IMM01",
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
      },
    );

    it("should return data from api if successful call with additional costs", async () => {
      const sessionData = {
        matterCode1: "FAML",
        matterCode2: "FPET",
        vatIndicator: false,
        startDate: "03/04/2025",
        lawCategory: immigrationLaw,
        caseStage: "_IMM01",
        validAdditionalFees: additionalFees,
        additionalCosts: [
          {
            levelCode: "LVL1",
            type: feeTypes.optionalUnit,
            value: "3",
          },
          {
            levelCode: "LVL3",
            type: feeTypes.optionalUnit,
            value: "1",
          },
          {
            levelCode: "LVL4",
            type: feeTypes.optionalFee,
            value: "2.34",
          },
          {
            levelCode: "LVL5",
            type: feeTypes.optionalBool,
            value: true,
          },
          {
            levelCode: "LVL6",
            type: feeTypes.optionalBool,
            value: false,
          },
        ],
      };

      const expectedRequestBody = {
        matterCode1: "FAML",
        matterCode2: "FPET",
        locationCode: notApplicable,
        caseStage: "_IMM01",
        levelCodes: [
          {
            levelCode: "LVL1",
            units: "3",
          },
          {
            levelCode: "LVL3",
            units: "1",
          },
          {
            levelCode: "LVL4",
            fee: "2.34",
          },
          {
            levelCode: "LVL5",
          },
        ],
      };

      axios.get.mockResolvedValue({
        data: {
          matterCode1: "FAML",
          matterCode2: "FPET",
          locationCode: notApplicable,
          caseStage: "_IMM01",
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
        vatIndicator: false,
        startDate: "03/04/2025",
        lawCategory: immigrationLaw,
        caseStage: "_IMM01",
      };

      await expect(() =>
        getCalculationResult(sessionData, axios),
      ).rejects.toThrow(Error);

      expect(axios.get).toHaveBeenCalledTimes(0);
    });

    it("should throw error if no matterCode2 in session data", async () => {
      const sessionData = {
        matterCode1: "FAML",
        vatIndicator: false,
        startDate: "03/04/2025",
        lawCategory: immigrationLaw,
        caseStage: "_IMM01",
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
        vatIndicator: false,
        startDate: "03/04/2025",
        lawCategory: immigrationLaw,
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
        vatIndicator: false,
        startDate: "03/04/2025",
        lawCategory: immigrationLaw,
        caseStage: "_IMM01",
      };

      const expectedRequestBody = {
        matterCode1: "FAML",
        matterCode2: "FPET",
        locationCode: notApplicable,
        caseStage: "_IMM01",
        levelCodes: [],
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

    const suppliedLessThanExpected = [
      {
        levelCode: "LVL1",
        type: feeTypes.optionalUnit,
        value: "3",
      },
    ];

    const suppliedOneThatIsUnexpected = [
      {
        levelCode: "LVL1",
        type: feeTypes.optionalUnit,
        value: "3",
      },
      {
        levelCode: "LVL3",
        type: feeTypes.optionalUnit,
        value: "1",
      },
      {
        levelCode: "LVL4",
        type: feeTypes.optionalFee,
        value: "2.34",
      },
      {
        levelCode: "LVL5",
        type: feeTypes.optionalBool,
        value: true,
      },
      {
        levelCode: "LVL8",
        type: feeTypes.optionalBool,
        value: false,
      },
    ];

    it.each([
      null,
      [],
      [{}],
      suppliedLessThanExpected,
      suppliedOneThatIsUnexpected,
    ])(
      "should throw error if additional costs user entered are insufficient",
      async (additionalCosts) => {
        const sessionData = {
          matterCode1: "FAML",
          matterCode2: "FPET",
          caseStage: "_IMM01",
          vatIndicator: false,
          startDate: "03/04/2025",
          lawCategory: immigrationLaw,
          validAdditionalFees: additionalFees,
          additionalCosts: additionalCosts,
        };

        await expect(() =>
          getCalculationResult(sessionData, axios),
        ).rejects.toThrow(Error);

        expect(axios.get).toHaveBeenCalledTimes(0);
      },
    );
  });

  it("should error if unexpected law category", async () => {
    const sessionData = {
      matterCode1: "FAML",
      matterCode2: "FPET",
      londonRate: "LDN",
      caseStage: "FPL01",
      vatIndicator: false,
      startDate: "03/04/2025",
      lawCategory: "navalLaw",
    };

    await expect(() =>
      getCalculationResult(sessionData, axios),
    ).rejects.toThrow(Error);

    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it("should error if undefined law category", async () => {
    const sessionData = {
      matterCode1: "FAML",
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
});
