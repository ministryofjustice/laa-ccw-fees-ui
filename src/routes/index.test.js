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
      'data': {
        'field1': 'blah',
        'field2': 'foo'
      },
      'otherstuff': true
    };

    await request(app).post("/").expect(302).expect("Location", "/law-category");

    // Should remove any legacy data
    expect(mockSession).toEqual({
      'data': {},
      'otherstuff': true
    })

  });

});

describe("GET /fee-entry", () => {
  let app;
  let mockSession = {};
  const csrfMock = jest.fn();
  app = express();

  beforeEach(() => {
    mockSession = {
      'data': {}
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
    
    mockSession = {}

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
        'data': {}
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

    await request(app).post("/fee-entry").expect(302).expect("Location", "/result");

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
      data: { result: "246.00", "lawCategory": "Immigration"},
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("You should have £246.00");
  });

  it("should error when result is missing", async () => {
    mockSession = {
      data: {lawCategory: "blah"},
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

  it("should error when law category is missing", async () => {
    mockSession = {
      data: {result: "1234.32"},
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
      "otherField": "blah"
    };

    const response = await request(app)
      .get("/result")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });
});
