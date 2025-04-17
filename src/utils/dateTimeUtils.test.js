import { validateEnteredDate, todayString } from "./dateTimeUtils";

const MARCH = 2; //Months are zero-indexed

describe("validateEnteredDate", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, MARCH, 31));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("should return null", () => {
    it("if valid GB date formats in the past", () => {
      expect(validateEnteredDate("01/10/2024")).toEqual(null);
      expect(validateEnteredDate("31/01/2023")).toEqual(null);
      expect(validateEnteredDate("10/01/2024")).toEqual(null);
    });

    it("if today", () => {
      expect(validateEnteredDate("31/03/2025")).toEqual(null);
    });

    it("if valid but missing a zero at the start", () => {
      expect(validateEnteredDate("1/10/2024")).toEqual(null);
      expect(validateEnteredDate("31/1/2023")).toEqual(null);
      expect(validateEnteredDate("1/2/2023")).toEqual(null);
    });
  });

  describe("should return error", () => {
    it("if date is valid format but in future", () => {
      expect(validateEnteredDate("01/04/2025")).toEqual(
        "cannot be in the future",
      );
      expect(validateEnteredDate("12/13/2924")).toEqual("is not valid");
    });

    it("if US date formats that are not GB formats", () => {
      expect(validateEnteredDate("01/31/2024")).toEqual("is not valid");
      expect(validateEnteredDate("12/13/2023")).toEqual("is not valid");
    });

    it("if ISO format", () => {
      expect(validateEnteredDate("2024/12/01")).toEqual("is not valid");
    });

    it("if not a date", () => {
      expect(validateEnteredDate("00/00/0000")).toEqual("is not valid");
      expect(validateEnteredDate("00/01/2024")).toEqual("is not valid");
      expect(validateEnteredDate("01/00/2024")).toEqual("is not valid");
      expect(validateEnteredDate("01/01/0000")).toEqual("is not valid");
    });

    it("if letters are involved", () => {
      expect(validateEnteredDate("aa/00/cccc")).toEqual("is not valid");
      expect(validateEnteredDate("notadate")).toEqual("is not valid");
    });
  });

  it("should handle leap years", () => {
    expect(validateEnteredDate("29/02/2024")).toEqual(null);
    expect(validateEnteredDate("29/02/2025")).toEqual("is not valid");
    expect(validateEnteredDate("29/02/2000")).toEqual(null);
    expect(validateEnteredDate("29/02/2100")).toEqual("is not valid");
  });
});

describe("todayString", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, MARCH, 31));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return the current date in GB format", () => {
    console.log(new Date());
    expect(todayString()).toEqual("31/03/2025");
  });
});
