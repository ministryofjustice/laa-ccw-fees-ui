import { feeTypes } from "./feeDetailsService";
import { getCalculationResult } from "./feeCalculatorService";
import { familyLaw, immigrationLaw } from "./lawCategoryService";
import { notApplicable } from "./londonRateService";

const additionalFees = [
  {
    levelCode: "LVL1",
    levelCodeType: feeTypes.optionalUnit,
  },
  {
    levelCode: "LVL2",
    levelCodeType: feeTypes.automatic,
  },
  {
    levelCode: "LVL3",
    levelCodeType: feeTypes.optionalUnit,
  },
  {
    levelCode: "LVL4",
    levelCodeType: feeTypes.optionalFee,
  },
  { levelCode: "LVL5", levelCodeType: feeTypes.optionalBool },
  { levelCode: "LVL6", levelCodeType: feeTypes.optionalBool },
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

      const feeBreakdown = [
        {
          feeType: "totals",
          amount: "86.00",
          vat: "17.20",
          total: "103.20",
        },
      ];
      axios.get.mockResolvedValue({
        data: {
          matterCode1: "FAML",
          matterCode2: "FPET",
          locationCode: "LDN",
          caseStage: "FPL01",
          amount: 120,
          total: 144,
          vat: 24,
          fees: feeBreakdown,
        },
      });

      const result = await getCalculationResult(sessionData, axios);

      expect(result).toEqual({
        amount: 120,
        total: 144,
        vat: 24,
        feeBreakdown: feeBreakdown,
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
          feeDetails: additionalCosts,
        };

        const expectedRequestBody = {
          matterCode1: "FAML",
          matterCode2: "FPET",
          locationCode: notApplicable,
          caseStage: "_IMM01",
          levelCodes: [],
        };

        const feeBreakdown = [
          {
            feeType: "totals",
            amount: "86.00",
            vat: "17.20",
            total: "103.20",
          },
        ];

        axios.get.mockResolvedValue({
          data: {
            matterCode1: "FAML",
            matterCode2: "FPET",
            locationCode: notApplicable,
            caseStage: "_IMM01",
            amount: 120,
            total: 144,
            vat: 24,
            fees: feeBreakdown,
          },
        });

        const result = await getCalculationResult(sessionData, axios);

        expect(result).toEqual({
          amount: 120,
          total: 144,
          vat: 24,
          feeBreakdown: feeBreakdown,
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
        feeDetails: additionalFees,
        additionalCosts: [
          {
            levelCode: "LVL1",
            levelCodeType: feeTypes.optionalUnit,
            value: "3",
          },
          {
            levelCode: "LVL3",
            levelCodeType: feeTypes.optionalUnit,
            value: "1",
          },
          {
            levelCode: "LVL4",
            levelCodeType: feeTypes.optionalFee,
            value: "2.34",
          },
          {
            levelCode: "LVL5",
            levelCodeType: feeTypes.optionalBool,
            value: true,
          },
          {
            levelCode: "LVL6",
            levelCodeType: feeTypes.optionalBool,
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

      const feeBreakdown = [
        {
          feeType: "LVL1",
          amount: "33.2",
          vat: "12.10",
          total: "43.30",
        },
        {
          levelCode: "LVL3",
          amount: "10",
          vat: "2",
          total: "12",
        },
        {
          levelCode: "LVL4",
          amount: "44",
          vat: "33.01",
          total: "77.01",
        },
        {
          levelCode: "LVL5",
          amount: "33.2",
          vat: "12.10",
          total: "43.30",
        },
      ];

      axios.get.mockResolvedValue({
        data: {
          matterCode1: "FAML",
          matterCode2: "FPET",
          locationCode: notApplicable,
          caseStage: "_IMM01",
          amount: 120,
          total: 144,
          vat: 24,
          fees: feeBreakdown,
        },
      });

      const result = await getCalculationResult(sessionData, axios);

      expect(result).toEqual({
        amount: 120,
        total: 144,
        vat: 24,
        feeBreakdown: feeBreakdown,
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
        levelCodeType: feeTypes.optionalUnit,
        value: "3",
      },
    ];

    const suppliedOneThatIsUnexpected = [
      {
        levelCode: "LVL1",
        levelCodeType: feeTypes.optionalUnit,
        value: "3",
      },
      {
        levelCode: "LVL3",
        levelCodeType: feeTypes.optionalUnit,
        value: "1",
      },
      {
        levelCode: "LVL4",
        levelCodeType: feeTypes.optionalFee,
        value: "2.34",
      },
      {
        levelCode: "LVL5",
        levelCodeType: feeTypes.optionalBool,
        value: true,
      },
      {
        levelCode: "LVL8",
        levelCodeType: feeTypes.optionalBool,
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
          feeDetails: additionalFees,
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
