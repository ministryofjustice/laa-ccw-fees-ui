import { validateEnteredDate, todayString, DateInputError } from "./dateTimeUtils"

const MARCH = 2; //Months are zero-indexed

describe("wasValidDateEntered", () => {

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2025, MARCH, 31));    
    })

    afterAll(() => {
        jest.useRealTimers();
    });

    describe("should return true", () => {
        it("if valid GB date formats in the past", () => {
            expect(validateEnteredDate("01/10/2024")).toEqual(true);
            expect(validateEnteredDate("31/01/2023")).toEqual(true);
            expect(validateEnteredDate("10/01/2024")).toEqual(true);
        })

        it("if today", () => {
            expect(validateEnteredDate("31/03/2025")).toEqual(true);
        })

        it("if valid but missing a zero at the start", () => {
            expect(validateEnteredDate("1/10/2024")).toEqual(true);
            expect(validateEnteredDate("31/1/2023")).toEqual(true);
            expect(validateEnteredDate("1/2/2023")).toEqual(true);
        })

    })

    describe("should return false", () => {
        it("if date is valid format but in future", () => {
            expect(() => validateEnteredDate("01/04/2025")).toThrow(DateInputError);
            expect(() => validateEnteredDate("12/13/2924")).toThrow(DateInputError);
        })
    
        it("if US date formats that are not GB formats", () => {
            expect(() => validateEnteredDate("01/31/2024")).toThrow(DateInputError);
            expect(() => validateEnteredDate("12/13/2023")).toThrow(DateInputError);
        })
    
        it("if ISO format", () => {
            expect(() => validateEnteredDate("2024/12/01")).toThrow(DateInputError);
        })
    
        it("if not a date", () => {
            expect(() => validateEnteredDate("00/00/0000")).toThrow(DateInputError);
            expect(() => validateEnteredDate("00/01/2024")).toThrow(DateInputError);
            expect(() => validateEnteredDate("01/00/2024")).toThrow(DateInputError);
            expect(() => validateEnteredDate("01/01/0000")).toThrow(DateInputError);
        })

        it("if letters are involved", () => {
            expect(() => validateEnteredDate("aa/00/cccc")).toThrow(DateInputError);
            expect(() => validateEnteredDate("notadate")).toThrow(DateInputError);
        })
    })
  
    it("should handle leap years", () => {
        expect(validateEnteredDate("29/02/2024")).toEqual(true);
        expect(() => validateEnteredDate("29/02/2025")).toThrow(DateInputError);
        expect(validateEnteredDate("29/02/2000")).toEqual(true);
        expect(() => validateEnteredDate("29/02/2100")).toThrow(DateInputError);

    })
})

// describe ("isDateAllowed", () => {


//     it("should return true if date in past", () => {
//         expect(isDateAllowed("30/03/2025")).toEqual(true)
//     })

//     it("should return true if date is today", () => {
//         expect(isDateAllowed("31/03/2025")).toEqual(true)
//     })

//     it("should return false if date in future", () => {
//         expect(isDateAllowed("01/04/2025")).toEqual(false)
//     })

//     it("should return false if date is invalid", () => {
//         expect(isDateAllowed("31/04/2025")).toEqual(false)
//     })
// })

describe("todayString", () => {
    beforeAll(() => {
        jest.useFakeTimers();
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