import { csrfSync } from "csrf-sync";
import { URL_ErrorPage } from "../routes/navigator";
import { interceptCSRFError } from "./setupCsrf";

describe("csrf-sync middleware", () => {
  let req, res, next;

  beforeEach(() => {
    // Create a fake request object with a session property
    req = {
      body: {},
      session: {}, // ensure session exists
      cookies: {},
    };
    // Create a fake response object
    res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      cookie: jest.fn(),
      setHeader: jest.fn(),
      redirect: jest.fn(),
    };
    // Create a next function spy
    next = jest.fn();
  });

  describe("csrfSynchronisedProtection middleware", () => {
    it("should call next() if the CSRF token is valid", () => {
      // Configure csrf-sync to extract token from req.body._csrf
      const { csrfSynchronisedProtection } = csrfSync({
        // eslint-disable-next-line
        getTokenFromRequest: (req) => req.body._csrf,
      });
      // Simulate a valid token:
      req.session.csrfToken = "valid-token";
      req.body._csrf = "valid-token";

      csrfSynchronisedProtection(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should call next() with an error when the CSRF token is missing from the request body", () => {
      const { csrfSynchronisedProtection } = csrfSync({
        // eslint-disable-next-line
        getTokenFromRequest: (req) => req.body._csrf,
      });
      // Simulate a session with a token, but the request body has no token.
      req.session.csrfToken = "valid-token";
      req.body._csrf = undefined;

      csrfSynchronisedProtection(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toMatch(/invalid csrf token/i);
    });

    it("should call next() with an error when the CSRF token is invalid", () => {
      const { csrfSynchronisedProtection } = csrfSync({
        // eslint-disable-next-line
        getTokenFromRequest: (req) => req.body._csrf,
      });
      // Simulate a session with a token, but the request body has a different token.
      req.session.csrfToken = "valid-token";
      req.body._csrf = "invalid-token";

      csrfSynchronisedProtection(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0];
      expect(errorArg).toBeInstanceOf(Error);
      expect(errorArg.message).toMatch(/invalid csrf token/i);
    });
  });

  describe("Middleware to expose CSRF token to views", () => {
    it("should set res.locals.csrfToken when req.csrfToken() is available", () => {
      // Simulate that the CSRF middleware has attached a csrfToken function
      // eslint-disable-next-line
      req.csrfToken = () => "generated-token";

      // Middleware to expose the token:
      // eslint-disable-next-line
      const exposeTokenMiddleware = (req, res, next) => {
        if (typeof req.csrfToken === "function") {
          res.locals.csrfToken = req.csrfToken();
        }
        next();
      };

      exposeTokenMiddleware(req, res, next);

      expect(res.locals.csrfToken).toBe("generated-token");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("Middleware to catch CSRF token errors", () => {
    it("should redirect to error page if CSRF token error", () => {
      const err = { code: "EBADCSRFTOKEN" };

      interceptCSRFError(err, req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(URL_ErrorPage);
      expect(next).toHaveBeenCalledTimes(0);
    });

    it("should call next if different error", () => {
      const err = { code: "BADDATA" };

      interceptCSRFError(err, req, res, next);

      expect(res.redirect).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalled();
    });
  });
});
