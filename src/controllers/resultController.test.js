import { getCalculationResult } from "../service/feeCalculatorService";
import { getSessionData } from "../utils";
import { showResultPage } from "./resultController";

jest.mock("../utils/sessionHelper");
jest.mock("../service/feeCalculatorService");

describe("showResultPage", () => {
  let axiosMiddleware = jest.fn();
  let render = jest.fn();
  let req = {
    csrfToken: jest.fn(),
    axiosMiddleware: axiosMiddleware,
  };
  let res = {
    render: render,
  };

  beforeEach(() => {
    req.csrfToken.mockReturnValue("mocked-csrf-token");
  });

  it("should render result page when no VAT", async () => {
    const sessionData = {
      vatIndicator: false,
    };
    getSessionData.mockReturnValue(sessionData);

    getCalculationResult.mockReturnValue({
      amount: 120,
      total: 144,
      vat: 24,
    });

    await showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      total: "£120.00",
      isVatRegistered: false,
      vatAmount: "£24.00",
    });

    expect(getCalculationResult).toHaveBeenCalledWith(
      sessionData,
      axiosMiddleware,
    );
  });

  it("should render result page when VAT", async () => {
    getSessionData.mockReturnValue({
      vatIndicator: true,
    });

    getCalculationResult.mockReturnValue({
      amount: 120,
      total: 144,
      vat: 24,
    });

    await showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      total: "£144.00",
      isVatRegistered: true,
      vatAmount: "£24.00",
    });
  });

  it("should render result page with VAT if indicator undefined", async () => {
    getSessionData.mockReturnValue({});

    getCalculationResult.mockReturnValue({
      amount: 120,
      total: 144,
      vat: 24,
    });

    await showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      total: "£144.00",
      isVatRegistered: true,
      vatAmount: "£24.00",
    });
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    getSessionData.mockImplementation(() => {
      throw new Error("No session data found");
    });

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });
  });

  it("should render error page if api call throws error", async () => {
    getSessionData.mockReturnValue({});

    getCalculationResult.mockImplementation(() => {
      throw new Error("API error");
    });

    showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred loading the page.",
      status: "An error occurred",
    });

    expect(getCalculationResult).toHaveBeenCalledWith({}, axiosMiddleware);
  });
});
