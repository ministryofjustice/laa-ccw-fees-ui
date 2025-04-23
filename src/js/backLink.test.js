/**
 * @jest-environment jsdom
 */
import { forceReloadOnBack, setupBackLink } from "./backLink";

describe("setupBackLink", () => {
  it("should set backlink event listener if id on page", () => {
    document.body.innerHTML = `<a id="backLinkDefault" href="#">Back</a>`;
    global.history.back = jest.fn();

    setupBackLink();

    const backButton = document.getElementById("backLinkDefault");
    backButton.click();

    expect(global.history.back).toHaveBeenCalled();
  });

  it("should not backlink event listener if id not present", () => {
    document.body.innerHTML = `<a id="backLink" href="#">Back</a>`;
    global.history.back = jest.fn();

    setupBackLink();

    const backButton = document.getElementById("backLink");
    backButton.click();

    expect(global.history.back).toHaveBeenCalledTimes(0);
  });
});

describe("forceReloadOnBack", () => {
  // Want to test it calls reload but that's read only so need to mock it all up
  const originalLocation = window.location;
  const originalPerformance = global.performance;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...originalLocation,
        reload: jest.fn(),
      },
    });

    Object.defineProperty(global, "performance", {
      value: {
        getEntriesByType: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Set it back to what it was so other tests don't get confused
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });

    global.performance = originalPerformance;
  });

  it("should reload if event persisted", () => {
    performance.getEntriesByType.mockReturnValue([]);

    const event = { persisted: true };

    forceReloadOnBack(event);

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should reload if event not persisted and last navigation event was a back_forward", () => {
    performance.getEntriesByType.mockReturnValue([
      {
        type: "back_forward",
      },
    ]);

    const event = { persisted: false };

    forceReloadOnBack(event);

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should not reload if event not persisted and last navigation event was not a back_forward", () => {
    performance.getEntriesByType.mockReturnValue([
      {
        type: "forward_back",
      },
      {
        type: "back_forward",
      },
    ]);

    const event = { persisted: false };

    forceReloadOnBack(event);

    expect(window.location.reload).toHaveBeenCalledTimes(0);
  });

  it("should not reload if event not persisted and last navigation event has no type", () => {
    performance.getEntriesByType.mockReturnValue([
      {
        name: "back_forward",
      },
    ]);

    const event = { persisted: false };

    forceReloadOnBack(event);

    expect(window.location.reload).toHaveBeenCalledTimes(0);
  });

  it("should not reload if event not persisted and no navigation events ", () => {
    performance.getEntriesByType.mockReturnValue([]);

    const event = { persisted: false };

    forceReloadOnBack(event);

    expect(window.location.reload).toHaveBeenCalledTimes(0);
  });
});
