import { getMatterCode2s, isValidMatterCode2 } from "./matterCode2Service";

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

describe("getMatterCode2s", () => {
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
      matterCode1: "MC1",
    };
  });

  it("should return matter codes from service if not been cached already", async () => {
    req.axiosMiddleware.get.mockResolvedValue(matterCodesAPIResponse);

    const returnedMatterCodes = await getMatterCode2s(req);
    expect(returnedMatterCodes).toEqual(expectedMatterCodeList);
    expect(req.session.data.validMatterCode2s).toEqual(expectedMatterCodeList);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith(
      "/matter-codes/MC1/matter-code-2",
    );
  });

  it("should return matter codes from session if have been cached", async () => {
    req.session.data = {
      matterCode1: "MC1",
      validMatterCode2s: expectedMatterCodeList,
    };

    const returnedMatterCodes = await getMatterCode2s(req);
    expect(returnedMatterCodes).toEqual(expectedMatterCodeList);
    expect(req.session.data.validMatterCode2s).toEqual(expectedMatterCodeList);

    expect(req.axiosMiddleware.get).toHaveBeenCalledTimes(0);
  });

  it("should let the error propogate if axios errors", async () => {
    req.axiosMiddleware.get.mockImplementation(() => {
      throw new Error("api error");
    });

    await expect(() => getMatterCode2s(req)).rejects.toThrow(Error);

    expect(req.axiosMiddleware.get).toHaveBeenCalledWith(
      "/matter-codes/MC1/matter-code-2",
    );
  });
});

describe("isValidMatterCode2", () => {
  it("should return true if valid matterCode2", () => {
    expect(isValidMatterCode2(expectedMatterCodeList, "FAMA")).toEqual(true);
  });

  it("should return false if invalid category", () => {
    expect(isValidMatterCode2(expectedMatterCodeList, "FBMA")).toEqual(false);
  });
});
