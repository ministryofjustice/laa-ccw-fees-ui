import {
  feeTypes,
  getFeeDetails,
  getDisplayableFees,
} from "./feeDetailsService";
import { familyLaw, immigrationLaw } from "./lawCategoryService";
import { notApplicable } from "./londonRateService";

const matterCode1 = "FAMA";
const matterCode2 = "FPET";
const caseStage = "_IMMD2";

const imstc = {
  levelCode: "_IMSTC",
  levelCodeType: feeTypes.optionalUnit,
  description: "Misc",
};
const imstd = {
  levelCode: "_IMSTD",
  levelCodeType: feeTypes.automatic,
  description: "Stuff",
};
const imstx = {
  levelCode: "_IMSTX",
  levelCodeType: feeTypes.optionalFee,
  description: "idk",
};
const imste = {
  levelCode: "_IMSTE",
  levelCodeType: feeTypes.optionalUnit,
  description: "Misc",
};
const imst = {
  levelCode: "_IMST",
  levelCodeType: feeTypes.optionalBool,
  description: "Misca",
};

const expectedFees = [imstd, imste];

const feeDetailAPIResponse = {
  data: {
    matterCode1: matterCode1,
    matterCode2: matterCode2,
    locationCode: notApplicable,
    caseStage: caseStage,
    fees: expectedFees,
  },
};

describe("getFeeDetails", () => {
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
      lawCategory: immigrationLaw,
    };
  });

  it("should return fee details from service if not been cached already", async () => {
    req.axiosMiddleware.get.mockResolvedValue(feeDetailAPIResponse);

    const returnedFeeDetails = await getFeeDetails(req);
    expect(returnedFeeDetails).toEqual(expectedFees);
    expect(req.session.data.feeDetails).toEqual(expectedFees);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith(
      "/fees/list-available",
      {
        data: {
          matterCode1: matterCode1,
          matterCode2: matterCode2,
          locationCode: notApplicable, //Hardcoded for immigration law
          caseStage: caseStage,
        },
      },
    );
  });

  it("should supply location code if family law", async () => {
    req.session.data.lawCategory = familyLaw;
    req.session.data.londonRate = "LDN";
    req.axiosMiddleware.get.mockResolvedValue(feeDetailAPIResponse);

    const returnedFeeDetails = await getFeeDetails(req);
    expect(returnedFeeDetails).toEqual(expectedFees);
    expect(req.session.data.feeDetails).toEqual(expectedFees);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith(
      "/fees/list-available",
      {
        data: {
          matterCode1: matterCode1,
          matterCode2: matterCode2,
          locationCode: "LDN",
          caseStage: caseStage,
        },
      },
    );
  });

  it("should return fee details from session if have been cached", async () => {
    req.session.data = {
      matterCode1: matterCode1,
      matterCode2: matterCode2,
      caseStage: caseStage,
      feeDetails: expectedFees,
    };

    const returnedFeeDetails = await getFeeDetails(req);
    expect(returnedFeeDetails).toEqual(expectedFees);
    expect(req.session.data.feeDetails).toEqual(expectedFees);
    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should let the error propogate if axios errors", async () => {
    req.axiosMiddleware.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() => getFeeDetails(req)).rejects.toThrow(Error);

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

    await expect(() => getFeeDetails(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no matterCode2 in session data", async () => {
    req.session.data = {
      matterCode1: matterCode1,
      caseStage: caseStage,
    };

    await expect(() => getFeeDetails(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should throw error if no caseStage in session data", async () => {
    req.session.data = {
      matterCode1: matterCode1,
      matterCode2: matterCode2,
    };

    await expect(() => getFeeDetails(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });
});

describe("getDisplayableFees", () => {
  it("should return only items with type as Optional", () => {
    const feeDetails = [imstc, imstx, imste, imstd, imst];

    expect(getDisplayableFees(feeDetails)).toEqual([imstc, imstx, imste, imst]);
  });
});
