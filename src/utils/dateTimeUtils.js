import { format, isValid, parse } from "date-fns";
const DATE_FORMAT = "dd/MM/yyyy";

export function todayString() {
    return format(new Date(), DATE_FORMAT)
}

function addMissingZeroes(inputDate){
    const [day, month, year] = inputDate.split('/');

    if (day == null || month == null || year == null){
        //Not in right format
        throw new DateInputError("Date is not in dd/MM/yyyy format")
    }

    // Ensure 0 added if needed to match the format
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');

    return `${paddedDay}/${paddedMonth}/${year}`;

}

export function validateEnteredDate(inputDate){

    const formattedInput = addMissingZeroes(inputDate)
    const parsedDate = parse(formattedInput, DATE_FORMAT, new Date());

    // Check date is valid
    if (!isValid(parsedDate)) {
        throw new DateInputError("Date is not a valid date")
    }

    if (parsedDate > new Date()){
        throw new DateInputError("Date cannot be in the future")
    }

    // Make sure it matches - handles some edge cases around timezones, weird formats, etc
    const formattedDate = format(parsedDate, DATE_FORMAT);

    if (formattedDate !== formattedDate){
        throw new DateInputError("Date parsing has failed")
    }

    return true;

};

class DateInputError extends Error{
    constructor(message){
        super("Date input error: " + message);
    }
}