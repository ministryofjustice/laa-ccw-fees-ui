import { getAdditionalFees, isValidUnitEntered } from "./additionalFeeService";
import { notApplicable } from "./londonRateService";

const matterCode1 = "FAMA";
const matterCode2 = "FPET";
const caseStage = "_IMMD2";

const expectedAdditionalFees = [
  {
    levelCode: "_IMSTD",
    type: "A",
    description: "Stuff",
  },
  {
    levelCode: "_IMSTE",
    type: "OU",
    description: "Misc",
  },
];

const additionalFeeAPIResponse = {
  data: {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
    locationCode: notApplicable,
    caseStage: caseStage,
    fees: expectedAdditionalFees,
  },
};

describe("getAdditionalFees", () => {
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
      matterCode1: matterCode1,
      matterCode2: matterCode2,
      caseStage: caseStage,
    };
  });

  it("should return additional fees from service if not been cached already", async () => {
    req.axiosMiddleware.get.mockResolvedValue(additionalFeeAPIResponse);

    const returnedAdditionalFees = await getAdditionalFees(req);
    expect(returnedAdditionalFees).toEqual(expectedAdditionalFees);
    expect(req.session.data.validAdditionalFees).toEqual(
      expectedAdditionalFees,
    );

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith(
      "/fees/list-available",
      {
        data: {
          matterCode1: matterCode1,
          matterCode2: matterCode2,
          locationCode: notApplicable,
          caseStage: caseStage,
        },
      },
    );
  });

  it("should return additional fees from session if have been cached", async () => {
    req.session.data = {
      matterCode1: matterCode1,
      matterCode2: matterCode2,
      caseStage: caseStage,
      validAdditionalFees: expectedAdditionalFees,
    };

    const returnedAdditionalFees = await getAdditionalFees(req);
    expect(returnedAdditionalFees).toEqual(expectedAdditionalFees);
    expect(req.session.data.validAdditionalFees).toEqual(
      expectedAdditionalFees,
    );
    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should let the error propogate if axios errors", async () => {
    req.axiosMiddleware.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() => getAdditionalFees(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith(
      "/fees/list-available",
      {
        data: {
          matterCode1: matterCode1,
          matterCode2: matterCode2,
          locationCode: notApplicable,
          caseStage: caseStage,
        },
      },
    );
  });

  it("should throw error if no matterCode1 in session data", async () => {
    req.session.data = {
      matterCode2: matterCode2,
      caseStage: caseStage,
    };

    await expect(() => getAdditionalFees(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no matterCode2 in session data", async () => {
    req.session.data = {
      matterCode1: matterCode1,
      caseStage: caseStage,
    };

    await expect(() => getAdditionalFees(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no caseStage in session data", async () => {
    req.session.data = {
      matterCode1: matterCode1,
      matterCode2: matterCode2,
    };

    await expect(() => getAdditionalFees(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });
});

describe("isValidUnitEntered", () => {

  it.each([
      ['0', true],
      ['1', true],
      ['2', true],
      ['3', true],
      ['4', true],
      ['5', true],
      ['6', true],
      ['7', true],
      ['8', true],
      ['9', true],
      ['10', false],
      ['-1', false],
      ['4.3', false],
      ['0.000000003', false],
      ['abd', false],
      ['', false],
      [' ', false]
    ])("when %s is entered should return %s", (value, expected) => {
      expect(isValidUnitEntered(value)).toEqual(expected)
    })

})