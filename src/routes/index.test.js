import request from "supertest";
import express from "express";
import { nunjucksSetup } from "../utils";
import indexRouter from "../routes/index";
import { getUrl } from "./urls";

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

  it("should render start page", async () => {
    csrfMock.mockReturnValue("mocked-csrf-token");
    const response = await request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("Start now");
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

      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should redirect to law category page", async () => {
    mockSession = {
      data: {
        field1: "blah",
        field2: "foo",
      },
      otherstuff: true,
    };

    await request(app)
      .post("/")
      .expect(302)
      .expect("Location", getUrl("claimStart"));

    // Should remove any legacy data
    expect(mockSession).toEqual({
      data: {},
      otherstuff: true,
    });
  });
});

describe("GET /result", () => {
  let app;
  let mockSession;
  app = express();

  beforeEach(() => {
    mockSession = {};

    // Mock the middleware
    app.use((req, _res, next) => {
      req.session = mockSession;
      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should render result page", async () => {
    mockSession = {
      data: { result: "246.00", lawCategory: "immigration" },
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("You should have £246.00");
  });

  it("should error when result is missing", async () => {
    mockSession = {
      data: { lawCategory: "blah" },
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

  it("should error when law category is missing", async () => {
    mockSession = {
      data: { result: "1234.32" },
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

  it("should error when session is missing", async () => {
    mockSession = null;

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

  it("should error when session data is missing", async () => {
    mockSession = {
      otherField: "blah",
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });
});
