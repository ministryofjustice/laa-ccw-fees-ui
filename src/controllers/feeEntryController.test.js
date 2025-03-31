import request from "supertest";
import express from "express";
import { nunjucksSetup } from "../utils";
import indexRouter from "../routes/index";

describe("GET /fee-entry", () => {
  let app;
  let mockSession = {};
  const csrfMock = jest.fn();
  app = express();

  beforeEach(() => {
    mockSession = {
      data: {},
    };

    // Mock the middleware
    app.use((req, _res, next) => {
      req.csrfToken = csrfMock;
      req.session = mockSession;

      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should render fee entry page", async () => {
    csrfMock.mockReturnValue("mocked-csrf-token");
    const response = await request(app)
      .get("/fee-entry")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("Enter a number");
  });

  it("should render error page if fails to load page", async () => {
    csrfMock.mockImplementation(() => {
      throw new Error("token problems");
    });

    const response = await request(app)
      .get("/fee-entry")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

  it("should render error page if no session data", async () => {
    mockSession = {};

    const response = await request(app)
      .get("/fee-entry")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });
});

describe("POST /fee-entry", () => {
  let app;
  let mockSession = {};
  let formData;
  const renderMock = jest.fn();
  app = express();

  beforeEach(() => {
    formData = 123;
    mockSession = {};
    renderMock.mockReset();

    // Mock the middleware
    app.use((req, _res, next) => {
      mockSession = {
        data: {},
      };

      // Make sure it exists
      req.axiosMiddleware = req.axiosMiddleware || {};
      req.axiosMiddleware.post = renderMock;
      req.session = mockSession;

      req.body = {
        fee: formData,
      };

      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should redirect to result page if successful call service", async () => {
    renderMock.mockReturnValue({
      status: 200,
      data: "236.00",
    });

    await request(app)
      .post("/fee-entry")
      .expect(302)
      .expect("Location", "/result");

    // Save value so result page can load it
    expect(mockSession.data.result).toEqual("236.00");

    expect(renderMock).toHaveBeenCalledWith("/fees/123");
  });

  describe("should error", () => {
    it("when api call fails", async () => {
      renderMock.mockImplementation(() => {
        throw new Error("API connection issue");
      });

      const response = await request(app)
        .post("/fee-entry")
        .expect("Content-Type", /html/)
        .expect(200);

      expect(response.text).toContain("An error occurred");

      expect(mockSession.data.result).toBeUndefined();

      expect(renderMock).toHaveBeenCalledWith("/fees/123");
    });

    it("when data from form is missing", async () => {
      formData = null;

      const response = await request(app)
        .post("/fee-entry")
        .expect("Content-Type", /html/)
        .expect(200);

      expect(response.text).toContain("An error occurred");

      expect(mockSession.data.result).toBeUndefined();

      expect(renderMock).toHaveBeenCalledTimes(0);
    });

    it("when data from form is not the right type", async () => {
      formData = "hello";

      const response = await request(app)
        .post("/fee-entry")
        .expect("Content-Type", /html/)
        .expect(200);

      expect(response.text).toContain("An error occurred");

      expect(mockSession.data.result).toBeUndefined();

      expect(renderMock).toHaveBeenCalledTimes(0);
    });
  });
});
