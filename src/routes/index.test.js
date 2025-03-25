import request from "supertest";
import express from "express";
import { nunjucksSetup } from "../utils";
import indexRouter from "../routes/index";

describe("GET /", () => {
  let app;
  const csrfMock = jest.fn();
  app = express();

  beforeEach(() => {

    // Mock the middleware
    app.use((req, _res, next) => {
      req.csrfToken = csrfMock;
      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });


  it("should render index page", async () => {

    csrfMock.mockReturnValue('mocked-csrf-token');
    const response = await request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("Enter a number");
  });

  it("should render error page if fails to load page", async () => {

    csrfMock.mockImplementation(() => {
      throw new Error("token problems");
    });

    const response = await request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

});

describe("POST /", () => {
  let app;
  let mockSession = {};
  const renderMock = jest.fn();
  app = express();

  beforeEach(() => {

    mockSession = {};
    renderMock.mockReset();

    // Mock the middleware
    app.use((req, _res, next) => {
      // Make sure it exists
      req.axiosMiddleware = req.axiosMiddleware || {};
      req.axiosMiddleware.post = renderMock;
      req.session = mockSession;

      req.body = {
        fee: 123
      }

      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });


  it("should redirect to result page if successful call service", async () => {

    renderMock.mockReturnValue({
      status: 200,
      data: "236.00"
    });

    await request(app)
      .post("/")
      .expect(302)
      .expect('Location', '/result');

    // Save value so result page can load it
    expect(mockSession.result).toEqual("236.00");

    expect(renderMock).toHaveBeenCalledWith("/fees/123")
  });

  it("should error if api call fails", async () => {

    renderMock.mockImplementation(() => {
      throw new Error("API connection issue");
    });

    const response = await request(app)
      .post("/")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");

    expect(mockSession.result).toBeUndefined();

    expect(renderMock).toHaveBeenCalledWith("/fees/123")
  });

  //TODO error if data missing

});

describe("GET /result", () => {
  let app;
  app = express();

  beforeEach(() => {

    // Mock the middleware
    app.use((req, _res, next) => {
      req.session = {
        result: "246.00"
      }
      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });


  it("should render result page", async () => {

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("You should have £246.00");
  });

    //TODO error if data missing
  // it("should render error page if fails to load page", async () => {

  //   csrfMock.mockImplementation(() => {
  //     throw new Error("token problems");
  //   });

  //   const response = await request(app)
  //     .get("/")
  //     .expect("Content-Type", /html/)
  //     .expect(200);

  //   expect(response.text).toContain("An error occurred");
  // });

});