import { getMatterCode1s, isValidMatterCode1 } from "./matterCode1Service";

const expectedMatterCodeList = [
  {
    matterCode: "FAMA",
    description: "Divorce",
  },
  {
    matterCode: "FAMB",
    description: "Dissolution",
  },
];

const matterCodesAPIResponse = {
  data: {
    matterCodes: expectedMatterCodeList,
  },
};

describe("getMatterCode1s", () => {
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
      lawCategory: "FAM",
    };
  });

  it("should return matter codes from service if not been cached already", async () => {
    req.axiosMiddleware.get.mockResolvedValue(matterCodesAPIResponse);

    const returnedMatterCodes = await getMatterCode1s(req);
    expect(returnedMatterCodes).toEqual(expectedMatterCodeList);
    expect(req.session.data.validMatterCode1s).toEqual(expectedMatterCodeList);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/matter-codes/FAM");
  });

  it("should return matter codes from session if have been cached", async () => {
    req.session.data = {
      lawCategory: "FAM",
      validMatterCode1s: expectedMatterCodeList,
    };

    const returnedMatterCodes = await getMatterCode1s(req);
    expect(returnedMatterCodes).toEqual(expectedMatterCodeList);
    expect(req.session.data.validMatterCode1s).toEqual(expectedMatterCodeList);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should let the error propogate if axios errors", async () => {
    req.axiosMiddleware.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() => getMatterCode1s(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith("/matter-codes/FAM");
  });
});

describe("isValidMatterCode1", () => {
  it("should return true if valid matterCode1", () => {
    expect(isValidMatterCode1(expectedMatterCodeList, "FAMA")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidMatterCode1(expectedMatterCodeList, "FBMA")).toEqual(false);
  });
});
