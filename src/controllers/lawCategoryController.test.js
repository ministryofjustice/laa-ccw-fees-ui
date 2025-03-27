import request from "supertest";
import express from "express";
import { nunjucksSetup } from "../utils";
import indexRouter from "../routes/index";
import { isValidLawCategory, getLawCategories } from "../service/lawCategoryService";

jest.mock('../service/lawCategoryService', () => ({
    getLawCategories: jest.fn(), 
    isValidLawCategory: jest.fn()
  }));

describe("GET /law-category", () => {
    let app;
    const csrfMock = jest.fn();
    app = express();
    let mockSession;

    beforeEach(() => {

        getLawCategories.mockReturnValue([
            {
                id: "family",
                description: "Family"
            },
            {
                id: "immigration",
                description: "Immigration"
            }
        ])

        // Mock the middleware
        app.use((req, _res, next) => {
            req.csrfToken = csrfMock;
            mockSession = {
                'data': {}
            };
            req.session = mockSession;

            next();
        });
        app.use("/", indexRouter);

        // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
        nunjucksSetup(app);
    });

    it("should render law category page", async () => {
        csrfMock.mockReturnValue("mocked-csrf-token");
        const response = await request(app)
            .get("/law-category")
            .expect("Content-Type", /html/)
            .expect(200);

        expect(response.text).toContain("Which category of law?");
        expect(response.text).toContain("Family");
        expect(response.text).toContain("Immigration");

    });

    it("should render error page if fails to load page", async () => {
        csrfMock.mockImplementation(() => {
            throw new Error("token problems");
        });

        const response = await request(app)
            .get("/law-category")
            .expect("Content-Type", /html/)
            .expect(200);

        expect(response.text).toContain("An error occurred");
    });

    it("should render error page if no existing session data already (as skipped workflow)", async () => {
  
        mockSession = {}

        const response = await request(app)
            .get("/law-category")
            .expect("Content-Type", /html/)
            .expect(200);

        expect(response.text).toContain("An error occurred");
    });

});

describe("POST /law-category", () => {
    let app;
    let mockSession = {};
    let formData;
    const renderMock = jest.fn();
    app = express();

    beforeEach(() => {
        formData = "family";
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
                category: formData,
            };

            next();
        });
        app.use("/", indexRouter);

        // Would be nice to mock the nunjucks rendering but not managed to figure that bit out
        nunjucksSetup(app);
    });

    it("should redirect to result page if valid form data is supplied", async () => {

        isValidLawCategory.mockReturnValue(true);

        await request(app).post("/law-category").expect(302).expect("Location", "/fee-entry");

        // Save value so result page can load it
        expect(mockSession.data.lawCategory).toEqual("family");

        expect(isValidLawCategory).toHaveBeenCalledWith("family");

    });

    describe("should error", () => {
        it("when data from form is missing", async () => {
            formData = null;

            const response = await request(app)
                .post("/law-category")
                .expect("Content-Type", /html/)
                .expect(200);

            expect(response.text).toContain("An error occurred");

            expect(mockSession.data.lawCategory).toBeUndefined();

        });

    });

    it("when data is not valid category", async () => {
        formData = "medical-malpractice";

        isValidLawCategory.mockReturnValue(false);


        const response = await request(app)
            .post("/law-category")
            .expect("Content-Type", /html/)
            .expect(200);

        expect(response.text).toContain("An error occurred");

        expect(mockSession.data.lawCategory).toBeUndefined();
        expect(isValidLawCategory).toHaveBeenCalledWith("medical-malpractice");

    });

});
