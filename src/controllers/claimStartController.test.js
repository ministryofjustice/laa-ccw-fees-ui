import request from "supertest";
import express from "express";
import { nunjucksSetup } from "../utils";
import indexRouter from "../routes/index";
import {
  isValidLawCategory,
  getLawCategories,
} from "../service/lawCategoryService";
import { getUrl } from "../routes/urls";

jest.mock("../service/lawCategoryService", () => ({
  getLawCategories: jest.fn(),
  isValidLawCategory: jest.fn(),
}));

const claimStartUrl = getUrl("claimStart");

describe("GET /claim-start", () => {
  let app;
  const csrfMock = jest.fn();
  app = express();
  let mockSession;

  getLawCategories.mockReturnValue([
    {
      id: "family",
      description: "Family",
    },
    {
      id: "immigration",
      description: "Immigration",
    },
  ]);

  beforeEach(() => {
    // Mock the middleware
    app.use((req, _res, next) => {
      req.csrfToken = csrfMock;
      mockSession = {
        data: {},
      };
      req.session = mockSession;

      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should render claim start page", async () => {
    csrfMock.mockReturnValue("mocked-csrf-token");
    const response = await request(app)
      .get(claimStartUrl)
      .expect("Content-Type", /html/)
      .expect(200);

    const pageContent = response.text

    expect(pageContent).toContain("Category of law");
    expect(pageContent).toContain("Family");
    expect(pageContent).toContain("Immigration");
    expect(pageContent).toContain("Date case was opened");
  });

  it("should render error page if fails to load page", async () => {
    csrfMock.mockImplementation(() => {
      throw new Error("token problems");
    });

    const response = await request(app)
      .get(claimStartUrl)
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });

  it("should render error page if no existing session data already (as skipped workflow)", async () => {
    mockSession = {};

    const response = await request(app)
      .get(claimStartUrl)
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");
  });
});

describe("POST /claim-start", () => {
  let app;
  let mockSession = {};
  let enteredLawCategory;
  let enteredDate;
  app = express();

  beforeEach(() => {
    enteredLawCategory = "family";
    enteredDate = "29/3/2025"

    // Mock the middleware
    app.use((req, _res, next) => {
      mockSession = {
        data: {},
      };
      req.session = mockSession;

      req.body = {
        category: enteredLawCategory,
        date: enteredDate
      };

      next();
    });
    app.use("/", indexRouter);

    // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
    nunjucksSetup(app);
  });

  it("should redirect to result page if valid form data is supplied", async () => {
    isValidLawCategory.mockReturnValue(true);

    await request(app)
      .post(claimStartUrl)
      .expect(302)
      .expect("Location", "/fee-entry");

    expect(mockSession.data.lawCategory).toEqual("family");
    expect(mockSession.data.startDate).toEqual("29/3/2025");

    expect(isValidLawCategory).toHaveBeenCalledWith("family");
  });

  describe("should error", () => {
    it("when law category from form is missing", async () => {
      enteredLawCategory = null;

      const response = await request(app)
        .post(claimStartUrl)
        .expect("Content-Type", /html/)
        .expect(200);

      expect(response.text).toContain("An error occurred");

      expect(mockSession.data.lawCategory).toBeUndefined();
      expect(mockSession.data.startDate).toBeUndefined();

    });

  it("when start date from form is missing", async () => {
    enteredDate = null;

    const response = await request(app)
      .post(claimStartUrl)
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");

    expect(mockSession.data.lawCategory).toBeUndefined();
    expect(mockSession.data.startDate).toBeUndefined();

  });

  it("when law category is not valid category", async () => {
    enteredLawCategory = "medical-malpractice";

    isValidLawCategory.mockReturnValue(false);

    const response = await request(app)
      .post(claimStartUrl)
      .expect("Content-Type", /html/)
      .expect(200);

    expect(response.text).toContain("An error occurred");

    expect(mockSession.data.lawCategory).toBeUndefined();
    expect(isValidLawCategory).toHaveBeenCalledWith("medical-malpractice");
  });
});

})
