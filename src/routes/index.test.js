import request from "supertest";
import express from "express";
import { nunjucksSetup } from "../utils";
import indexRouter from "../routes/index";

describe("GET /", () => {
  let app;
  const renderMock = jest.fn();
  app = express();

  beforeEach(() => {
    // Mock the middleware
    app.use((req, _res, next) => {
      // Make sure it exists
      req.axiosMiddleware = req.axiosMiddleware || {};
      req.axiosMiddleware.get = renderMock;
      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should render index page when api call successful", async () => {
    renderMock.mockReturnValue({
      status: 200,
      data: { blah: "foo", bar: "boo" },
    });

    const response = await request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("foo");
  });

  it("should render error page when api call throws error", async () => {
    renderMock.mockImplementation(() => {
      throw new Error("API connection issue");
    });

    const response = await request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });
});
