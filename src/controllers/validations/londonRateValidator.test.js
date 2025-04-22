import { validateLondonRate } from "./londonRateValidator.js";

describe("validateLondonRate", () => {
  it("should not return errors when london rate is valid", () => {
    expect(validateLondonRate("LDN")).toEqual({
      list: [],
      messages: {},
    });
  });

  it.each([null, ""])(
    "should return errors when london rate = %s",
    (londonRate) => {
      expect(validateLondonRate(londonRate)).toEqual({
        list: [
          {
            href: "#londonRate",
            text: "'London/Non-London Rate' not entered",
          },
        ],
        messages: {
          londonRate: {
            text: "'London/Non-London Rate' not entered",
          },
        },
      });
    },
  );

  it("should return errors when londonRate is invalid", () => {
    expect(validateLondonRate("BLAH")).toEqual({
      list: [
        {
          href: "#londonRate",
          text: "'London/Non-London Rate' is not valid",
        },
      ],
      messages: {
        londonRate: {
          text: "'London/Non-London Rate' is not valid",
        },
      },
    });
  });
});
