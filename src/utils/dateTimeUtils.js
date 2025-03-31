import { format, isValid, parse } from "date-fns";
const DATE_FORMAT = "dd/MM/yyyy";

export function todayString() {
    return format(new Date(), DATE_FORMAT)
}

export function isDateValid(inputDate){

    const [day, month, year] = inputDate.split('/');

    if (day == null || month == null || year == null){
        //Not in right format
        return false;
    }

    // Ensure 0 added if needed to match the format
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');

    const formattedInput = `${paddedDay}/${paddedMonth}/${year}`;

    // Turn into a date object
    const parsedDate = parse(formattedInput, DATE_FORMAT, new Date());

    // Check date is valid
    if (!isValid(parsedDate)) {
        return false;
    }

    // Make sure it matches - handles some edge cases around timezones, weird formats, etc
    const formattedDate = format(parsedDate, DATE_FORMAT);
    return formattedInput === formattedDate;

}