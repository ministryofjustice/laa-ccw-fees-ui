/**
 * @jest-environment jsdom
 */
import { setupBackLink } from "./backLink";

describe("setupBackLink", () => {
  test("should set backlink event listener if id on page", () => {
    document.body.innerHTML = `<a id="backLinkDefault" href="#">Back</a>`;
    global.history.back = jest.fn();

    setupBackLink();

    const backButton = document.getElementById("backLinkDefault");
    backButton.click();

    expect(global.history.back).toHaveBeenCalled();
  });

  test("should not backlink event listener if id not present", () => {
    document.body.innerHTML = `<a id="backLink" href="#">Back</a>`;
    global.history.back = jest.fn();

    setupBackLink();

    const backButton = document.getElementById("backLink");
    backButton.click();

    expect(global.history.back).toHaveBeenCalledTimes(0);
  });
});
