import { feeTypes } from "../service/feeDetailsService";
import { getCalculationResult } from "../service/feeCalculatorService";
import { getSessionData } from "../service/sessionDataService";
import { showResultPage } from "./resultController";

jest.mock("../service/sessionDataService");
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
      feeBreakdown: [
        {
          feeType: "totals",
          amount: "33.2",
          vat: "12.10",
          total: "43.30",
        },
      ],
    });

    await showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      total: "£120.00",
      isVatRegistered: false,
      vatAmount: "£24.00",
      breakdown: [
        {
          desc: "Total",
          amount: "£33.20",
        },
      ],
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
      feeBreakdown: [
        {
          feeType: "totals",
          amount: "120",
          vat: "24.0",
          total: "144.00",
        },
      ],
    });

    await showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      total: "£144.00",
      isVatRegistered: true,
      vatAmount: "£24.00",
      breakdown: [
        {
          desc: "Total",
          amount: "£144.00",
        },
        {
          desc: "of which VAT",
          amount: "£24.00",
        },
      ],
    });
  });

  it("should build up the breakdown by replacing code with description and adding currency formatting", async () => {
    getSessionData.mockReturnValue({
      vatIndicator: true,
      feeDetails: [
        {
          levelCode: "_IMSTD",
          levelCodeType: feeTypes.automatic,
          description: "Stuff",
        },
        {
          levelCode: "_IMSTE",
          levelCodeType: feeTypes.optionalUnit,
          description: "Misc",
        },
      ],
    });

    getCalculationResult.mockReturnValue({
      amount: 120,
      total: 144,
      vat: 24,
      feeBreakdown: [
        {
          feeType: "_IMSTD",
          amount: "33.33",
          vat: "12.3",
          total: "45.63",
        },
        {
          feeType: "_IMSTE",
          amount: "44.55",
          vat: "22.1",
          total: "66.65",
        },
        {
          feeType: "totals",
          amount: "120",
          vat: "24.0",
          total: "144.00",
        },
      ],
    });

    await showResultPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/result", {
      total: "£144.00",
      isVatRegistered: true,
      vatAmount: "£24.00",
      breakdown: [
        {
          desc: "Stuff",
          amount: "£33.33",
        },
        {
          desc: "Misc",
          amount: "£44.55",
        },
        {
          desc: "Total",
          amount: "£144.00",
        },
        {
          desc: "of which VAT",
          amount: "£24.00",
        },
      ],
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
      breakdown: [],
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
