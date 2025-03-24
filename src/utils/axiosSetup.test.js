jest.mock("../../config", () => ({
  API: {
    PROTOCOL: "https",
    HOST: "localhost",
    VERSION: "v1",
  },
}));

import { axiosMiddleware } from "./axiosSetup";

describe("axiosSetup middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { get: jest.fn(), protocol: "http" };
    res = {};
    next = jest.fn();
  });

  it("should call next() after setting up axios when http", () => {
    req = { get: jest.fn(), protocol: "http" };

    req.get.mockReturnValue("localhost");

    axiosMiddleware(req, res, next);

    // Ensure its setup the axios instance
    expect(req.axiosMiddleware).toBeDefined();
    expect(req.axiosMiddleware.axiosInstance).toBeDefined();

    // Ensure its setup the logging functions
    expect(
      req.axiosMiddleware.axiosInstance.interceptors.request,
    ).toBeDefined();
    expect(
      req.axiosMiddleware.axiosInstance.interceptors.response,
    ).toBeDefined();

    // Ensure base url is correct
    const expectedBaseURL = `https://localhost/v1`;
    expect(req.axiosMiddleware.axiosInstance.defaults.baseURL).toBe(
      expectedBaseURL,
    );

    expect(next).toHaveBeenCalled();
  });
});
