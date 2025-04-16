import { validateClaimStart } from "./claimStartValidator.js";

describe("validateClaimStart", () => {
  it("should not return errors when date and category is valid", () => {
    expect(validateClaimStart("01/01/2025", "FAM")).toEqual({
      list: [],
      messages: {},
    });
  });

  it.each([null, ""])("should return errors when date = %s", (date) => {
    expect(validateClaimStart(date, "FAM")).toEqual({
      list: [
        {
          href: "#date",
          text: "'Date case was opened' not entered",
        },
      ],
      messages: {
        date: {
          text: "'Date case was opened' not entered",
        },
      },
    });
  });

  it("should return errors when date is invalid", () => {
    expect(validateClaimStart("24/24/2025", "FAM")).toEqual({
      list: [
        {
          href: "#date",
          text: "'Date case was opened' is not valid",
        },
      ],
      messages: {
        date: {
          text: "'Date case was opened' is not valid",
        },
      },
    });
  });

  it.each([null, ""])(
    "should return errors when category is missing",
    (category) => {
      expect(validateClaimStart("12/12/2024", category)).toEqual({
        list: [
          {
            href: "#category",
            text: "'Law Category' not entered",
          },
        ],
        messages: {
          category: {
            text: "'Law Category' not entered",
          },
        },
      });
    },
  );

  it("should return errors when category invalid", () => {
    expect(validateClaimStart("01/01/2025", "BLAH")).toEqual({
      list: [
        {
          href: "#category",
          text: "'Law Category' is not valid",
        },
      ],
      messages: {
        category: {
          text: "'Law Category' is not valid",
        },
      },
    });
  });

  it.each([
    [null, null],
    ["", ""],
  ])(
    "should return errors when both date and category are missing",
    (date, category) => {
      expect(validateClaimStart(date, category)).toEqual({
        list: [
          {
            href: "#date",
            text: "'Date case was opened' not entered",
          },
          {
            href: "#category",
            text: "'Law Category' not entered",
          },
        ],
        messages: {
          date: {
            text: "'Date case was opened' not entered",
          },
          category: {
            text: "'Law Category' not entered",
          },
        },
      });
    },
  );
});
