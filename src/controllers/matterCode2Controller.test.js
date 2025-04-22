import {
  getMatterCode2s,
  isValidMatterCode2,
} from "../service/matterCode2Service";
import {
  postMatterCode2Page,
  showMatterCode2Page,
} from "./matterCode2Controller";
import { getNextPage, URL_MatterCode2 } from "../routes/navigator";
import { cleanData, validateSession } from "../service/sessionDataService";
import { validateMatterCode2 } from "./validations/matterCode2Validator";

jest.mock("../service/matterCode2Service");
jest.mock("../service/sessionDataService");
jest.mock("../routes/navigator.js");
jest.mock("./validations/matterCode2Validator");

const matterCode2s = [
  {
    id: "MC2A",
    description: "Matter code A",
  },
  {
    id: "MC2B",
    description: "Matter code B",
  },
];

const chosenMatterCode = "MC2A";

describe("matterCode2Controller", () => {
  describe("showMatterCode2Page", () => {
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
      getMatterCode2s.mockReturnValue(matterCode2s);
      validateSession.mockReturnValue(true);

      req.csrfToken.mockReturnValue("mocked-csrf-token");
    });

    it("should render matter code 2 page", async () => {
      await showMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/matterCode", {
        matterCodes: matterCode2s,
        csrfToken: "mocked-csrf-token",
        id: "matterCode2",
        label: "Matter Code 2",
        errors: {},
        formValues: {},
      });
    });

    it("should prepopuate data if in session", async () => {
      req.session.data.matterCode2 = chosenMatterCode;
      await showMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/matterCode", {
        matterCodes: matterCode2s,
        csrfToken: "mocked-csrf-token",
        id: "matterCode2",
        label: "Matter Code 2",
        errors: {},
        formValues: {
          matterCode2: chosenMatterCode,
        },
      });

      expect(getMatterCode2s).toHaveBeenCalledWith(req);
    });

    it("should display validation errors if supplied", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      await showMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/matterCode", {
        matterCodes: matterCode2s,
        csrfToken: "mocked-csrf-token",
        id: "matterCode2",
        label: "Matter Code 2",
        errors: mockError,
        formValues: mockFormValues,
      });

      expect(getMatterCode2s).toHaveBeenCalledWith(req);
    });

    it("should delete validation errors if supplied", async () => {
      const mockError = { error: true };
      const mockFormValues = { value1: 2 };
      req.session.formError = mockError;
      req.session.formValues = mockFormValues;

      await showMatterCode2Page(req, res);

      expect(req.session.formError).toBeUndefined();
      expect(req.session.formValues).toBeUndefined();
    });

    it("should render error page if fails to load page", async () => {
      req.csrfToken.mockImplementation(() => {
        throw new Error("token problems");
      });

      await showMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if no existing session data already (as skipped workflow)", async () => {
      validateSession.mockImplementation(() => {
        throw new Error("No session data found");
      });

      await showMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });
    });

    it("should render error page if getMatterCode2s call throws error", async () => {
      getMatterCode2s.mockImplementation(() => {
        throw new Error("API error");
      });

      await showMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred loading the page.",
        status: "An error occurred",
      });

      expect(getMatterCode2s).toHaveBeenCalledWith(req);
    });
  });

  describe("postMatterCode2Page", () => {
    let req = {};
    let res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    beforeEach(() => {
      getMatterCode2s.mockResolvedValue(matterCode2s);
      validateMatterCode2.mockReturnValue(true);

      req = {
        session: {
          data: {},
        },
        body: {},
      };

      req.body.matterCode2 = chosenMatterCode;
    });

    it("should redirect to result page if valid form data is supplied", async () => {
      getNextPage.mockReturnValue("nextPage");

      await postMatterCode2Page(req, res);

      expect(res.redirect).toHaveBeenCalledWith("nextPage");
      expect(req.session.data.matterCode2).toEqual(chosenMatterCode);

      expect(getMatterCode2s).toHaveBeenCalledWith(req);
      expect(validateMatterCode2).toHaveBeenCalledWith(
        matterCode2s,
        chosenMatterCode,
      );
      expect(getNextPage).toHaveBeenCalledWith(
        URL_MatterCode2,
        req.session.data,
      );
    });

    it("should clean up data that depends on matter code 2 if value changed", async () => {
      req.session.data.matterCode2 = "IMM";
      await postMatterCode2Page(req, res);

      expect(cleanData).toHaveBeenCalledWith(req, URL_MatterCode2);
    });

    it("should keep data that depends on matter code 2 if value not changed", async () => {
      req.session.data.matterCode2 = chosenMatterCode;
      await postMatterCode2Page(req, res);

      expect(cleanData).toHaveBeenCalledTimes(0);
    });

    it("redirect to GET if need to display validation errors", async () => {
      const mockError = {
        list: [{ error: "error" }],
      };

      validateMatterCode2.mockReturnValue(mockError);

      await postMatterCode2Page(req, res);

      expect(res.redirect).toHaveBeenCalledWith(URL_MatterCode2);
      expect(req.session.formError).toEqual(mockError);
      expect(req.session.formValues).toEqual({
        matterCode2: chosenMatterCode,
      });
      expect(req.session.data.matterCode2).toBeUndefined();
    });

    it("should render error page if getMatterCode2s call throws error", async () => {
      getMatterCode2s.mockImplementation(() => {
        throw new Error("API error");
      });

      await postMatterCode2Page(req, res);

      expect(res.render).toHaveBeenCalledWith("main/error", {
        error: "An error occurred saving the answer.",
        status: "An error occurred",
      });

      expect(getMatterCode2s).toHaveBeenCalledWith(req);
    });
  });
});
