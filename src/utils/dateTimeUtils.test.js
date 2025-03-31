import { isDateValid, todayString } from "./dateTimeUtils"

describe("isDateValid", () => {

    describe("should return true", () => {
        it("if valid GB date formats", () => {
            expect(isDateValid("01/10/2024")).toEqual(true);
            expect(isDateValid("31/01/2023")).toEqual(true);
            expect(isDateValid("10/01/2024")).toEqual(true);
        })

        it("if valid but missing a zero at the start", () => {
            expect(isDateValid("1/10/2024")).toEqual(true);
            expect(isDateValid("31/1/2023")).toEqual(true);
            expect(isDateValid("1/2/2023")).toEqual(true);
        })

    })

    describe("should return false", () => {
        it("if US date formats that are not GB formats", () => {
            expect(isDateValid("01/31/2024")).toEqual(false);
            expect(isDateValid("12/13/2023")).toEqual(false);
        })
    
        it("if ISO format", () => {
            expect(isDateValid("2024/12/01")).toEqual(false);
        })
    
        it("if not a date", () => {
            expect(isDateValid("00/00/0000")).toEqual(false);
            expect(isDateValid("00/01/2024")).toEqual(false);
            expect(isDateValid("01/00/2024")).toEqual(false);
            expect(isDateValid("01/01/0000")).toEqual(false);
        })

        it("if letters are involved", () => {
            expect(isDateValid("aa/00/cccc")).toEqual(false);
            expect(isDateValid("notadate")).toEqual(false);
        })
    })
  
    it("should handle leap years", () => {
        expect(isDateValid("29/02/2024")).toEqual(true);
        expect(isDateValid("29/02/2025")).toEqual(false);
        expect(isDateValid("29/02/2000")).toEqual(true);
        expect(isDateValid("29/02/2100")).toEqual(false);

    })
})

describe("todayString", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        const MARCH = 2; //Months are zero-indexed
        jest.setSystemTime(new Date(2025, MARCH, 31));    
    })

    afterAll(() => {
        jest.useRealTimers();
    });

    it("should return the current date in GB format", () => {
        console.log(new Date());
        expect(todayString()).toEqual("31/03/2025");
    })
    
})