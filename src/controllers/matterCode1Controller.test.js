import { getMatterCode1s } from "../service/matterCode1Service";
import {
  postMatterCode1Page,
  showMatterCode1Page,
} from "./matterCode1Controller";
import { getNextPage, URL_MatterCode1 } from "../routes/navigator";
import { cleanData, validateSession } from "../service/sessionDataService";
import { validateMatterCode1 } from "./validations/matterCode1Validator";

jest.mock("../service/matterCode1Service");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");
jest.mock("./validations/matterCode1Validator");

const matterCode1s = [
  {
    matterCode: "MC1A",
    description: "Matter code A",
  },
  {
    matterCode: "MC1B",
    description: "Matter code B",
  },
];

const chosenMatterCode = "MC1A";

describe("matterCode1Controller", () => {
  describe("showMatterCode1Page", () => {
    let req = {
      csrfToken: jest.fn(),
      session: {
        data: {},
      },
    };
    let res = {
      render: jest.fn(),
    };

    beforeEach(() => {
      getMatterCode1s.mockResolvedValue(matterCode1s);
      validateSession.mockReturnValue(true);

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render matter code 1 page", async () => {
      await showMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/matterCode", {
        matterCodes: matterCode1s,
        csrfToken: "mocked-csrf-token",
        id: "matterCode1",
        label: "Matter Code 1",
        errors: {},
        formValues: {},
      });

      expect(getMatterCode1s).toHaveBeenCalledWith(req);
    });

    it("should prepopuate data if in session", async () => {
      req.session.data.matterCode1 = chosenMatterCode;
      await showMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/matterCode", {
        matterCodes: matterCode1s,
        csrfToken: "mocked-csrf-token",
        id: "matterCode1",
        label: "Matter Code 1",
        errors: {},
        formValues: {
          matterCode1: chosenMatterCode,
        },
      });

      expect(getMatterCode1s).toHaveBeenCalledWith(req);
    });

    it("should display validation errors if supplied", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      await showMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/matterCode", {
        matterCodes: matterCode1s,
        csrfToken: "mocked-csrf-token",
        id: "matterCode1",
        label: "Matter Code 1",
        errors: mockError,
        formValues: mockFormValues,
      });

      expect(getMatterCode1s).toHaveBeenCalledWith(req);
    });

    it("should delete validation errors if supplied", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      await showMatterCode1Page(req, res);

      expect(req.session.formError).toBeUndefined();
      expect(req.session.formValues).toBeUndefined();
    });

    it("should render error page if fails to load page", async () => {
      req.csrfToken.mockImplementation(() => {
        throw new Error("token problems");
      });

      await showMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if no existing session data already (as skipped workflow)", async () => {
      validateSession.mockImplementation(() => {
        throw new Error("No session data found");
      });

      await showMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if getMatterCode1s call throws error", async () => {
      getMatterCode1s.mockImplementation(() => {
        throw new Error("API error");
      });

      await showMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });

      expect(getMatterCode1s).toHaveBeenCalledWith(req);
    });
  });

  describe("postMatterCode1Page", () => {
    let req = {};
    let res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    beforeEach(() => {
      getMatterCode1s.mockResolvedValue(matterCode1s);
      validateMatterCode1.mockReturnValue({});

      req = {
        session: {
          data: {},
        },
        body: {},
      };

      req.body.matterCode1 = chosenMatterCode;
    });

    it("should redirect to result page if valid form data is supplied", async () => {
      getNextPage.mockReturnValue("nextPage");

      await postMatterCode1Page(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(req.session.data.matterCode1).toEqual(chosenMatterCode);

      expect(validateMatterCode1).toHaveBeenCalledWith(
        matterCode1s,
        chosenMatterCode,
      );
      expect(getNextPage).toHaveBeenCalledWith(
        URL_MatterCode1,
        req.session.data,
      );
      expect(getMatterCode1s).toHaveBeenCalledWith(req);
    });

    it("should clean up data that depends on matter code 1 if value changed", async () => {
      req.session.data.matterCode1 = "IMM";
      await postMatterCode1Page(req, res);

      expect(cleanData).toHaveBeenCalledWith(req, URL_MatterCode1);
    });

    it("should keep data that depends on matter code 1 if value not changed", async () => {
      req.session.data.matterCode1 = chosenMatterCode;
      await postMatterCode1Page(req, res);

      expect(cleanData).toHaveBeenCalledTimes(0);
    });

    it("redirect to GET if need to display validation errors", async () => {
      const mockError = {
        list: [{ error: "error" }],
      };
      validateMatterCode1.mockReturnValue(mockError);
      await postMatterCode1Page(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_MatterCode1);
      expect(req.session.formError).toEqual(mockError);
      expect(req.session.formValues).toEqual({
        matterCode1: chosenMatterCode,
      });
      expect(req.session.data.matterCode1).toBeUndefined();
    });

    it("should render error page if getMatterCode1s call throws error", async () => {
      getMatterCode1s.mockImplementation(() => {
        throw new Error("API error");
      });

      await postMatterCode1Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(getMatterCode1s).toHaveBeenCalledWith(req);
    });
  });
});
