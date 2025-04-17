import { validateVatIndicator } from "./vatIndicatorValidator.js";

describe("validateVatIndicator", () => {
  it.each(["yes", "no"])(
    "should not return errors when vat indicator = %s",
    (vatIndicator) => {
      expect(validateVatIndicator(vatIndicator)).toEqual({
        list: [],
        messages: {},
      });
    },
  );

  it.each([null, ""])(
    "should return errors when vat indicator = %s",
    (vatIndicator) => {
      expect(validateVatIndicator(vatIndicator)).toEqual({
        list: [
          {
            href: "#vatIndicator",
            text: "'Vat Indicator' not entered",
          },
        ],
        messages: {
          vatIndicator: {
            text: "'Vat Indicator' not entered",
          },
        },
      });
    },
  );

  it("should return errors when vat indicator is invalid", () => {
    expect(validateVatIndicator("BLAH")).toEqual({
      list: [
        {
          href: "#vatIndicator",
          text: "'Vat Indicator' is not valid",
        },
      ],
      messages: {
        vatIndicator: {
          text: "'Vat Indicator' is not valid",
        },
      },
    });
  });
});
