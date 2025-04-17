import { feeTypes } from "../../service/feeDetailsService";
import { validateAndReturnAdditionalCostValue } from "./additionalCostValidator";

describe("validateAndReturnAdditionalCostValue", () => {
  it.each([null, undefined])("should error if value is %s", (value) => {
    expect(validateAndReturnAdditionalCostValue(value, {})).toEqual({
      error: "not entered",
    });
  });

  describe("for an optional fee field", () => {
    const feeField = {
      levelCodeType: feeTypes.optionalFee,
      levelCode: "_IMM01",
    };

    it.each([" ", "    "])("return zero if field left empty", (value) => {
      expect(validateAndReturnAdditionalCostValue(value, feeField)).toEqual({
        value: "0",
      });
    });

    it.each(["123.45", "123", "2", "0", "0.01"])(
      "when valid value %s is entered should return value",
      (value) => {
        expect(validateAndReturnAdditionalCostValue(value, feeField)).toEqual({
          value,
        });
      },
    );

    it.each(["-1", "-123.43", "abdc", "£43.12", "123.456"])(
      "when invalid value %s is entered should throw error",
      (value) => {
        expect(validateAndReturnAdditionalCostValue(value, feeField)).toEqual({
          error: "is not valid",
        });
      },
    );
  });

  describe("for an optional unit field", () => {
    const feeField = {
      levelCodeType: feeTypes.optionalUnit,
      levelCode: "_IMM01",
    };

    it.each(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])(
      "when valid value %s is entered should return value",
      (value) => {
        expect(validateAndReturnAdditionalCostValue(value, feeField)).toEqual({
          value,
        });
      },
    );

    it.each(["10", "-1", "4.3", "0.000000003", "abd", "", " "])(
      "when invalid value %s is entered should throw error",
      (value) => {
        expect(validateAndReturnAdditionalCostValue(value, feeField)).toEqual({
          error: "must be a number between 0 and 9",
        });
      },
    );
  });

  describe("for an optional boolean field", () => {
    const feeField = {
      levelCodeType: feeTypes.optionalBool,
      levelCode: "_IMM01",
    };

    it("when yes is selected should return true", () => {
      expect(validateAndReturnAdditionalCostValue("yes", feeField)).toEqual({
        value: true,
      });
    });

    it("when no is selected should return false", () => {
      expect(validateAndReturnAdditionalCostValue("no", feeField)).toEqual({
        value: false,
      });
    });

    it.each(["YES", "true", "false", "1", "123.456"])(
      "when invalid value %s is entered should throw error",
      (value) => {
        expect(validateAndReturnAdditionalCostValue(value, feeField)).toEqual({
          error: "is not valid",
        });
      },
    );
  });

  it("should error if unrecognised fee type", () => {
    expect(
      validateAndReturnAdditionalCostValue("1234", {
        levelCodeType: feeTypes.automatic,
      }),
    ).toEqual({ error: "is not valid" });
  });
});
