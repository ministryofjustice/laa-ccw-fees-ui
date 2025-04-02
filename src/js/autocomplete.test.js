/**
 * @jest-environment jsdom
 */
import { setupAutocomplete } from "./autocomplete";
import accessibleAutocomplete from "accessible-autocomplete";

jest.mock("accessible-autocomplete", () => ({
  enhanceSelectElement: jest.fn(),
}));

describe("initAutocomplete", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select class="autocomplete-select" autocomplete-placeholder="placeholder text">
        <option value="a">A</option>
        <option value="b">B</option>
      </select>
    `;
  });

  test("should enhance select elements with accessibleAutocomplete", () => {
    setupAutocomplete();

    const selectElement = document.querySelector(".autocomplete-select");
    expect(accessibleAutocomplete.enhanceSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ selectElement })
    );
  });

  test("should set placeholder correctly", () => {
    setupAutocomplete();

    expect(accessibleAutocomplete.enhanceSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ placeholder: "placeholder text" })
    );
  });

  test("should not error if no autocomplete-select elements exist on this page", () => {
    // Most pages don't have an accessible-autocomplete!
    document.body.innerHTML = "";
    expect(() => setupAutocomplete()).not.toThrow();
  });

  test("should not error if select elements has no options", () => {
    document.body.innerHTML = `<select class="autocomplete-select" autocomplete-placeholder="placeholder text">
      </select>`;
    expect(() => setupAutocomplete()).not.toThrow();
  });
});
