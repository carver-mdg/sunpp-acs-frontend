/**
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
export function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * 
 */
export function generateUniqueID() {
    let uniqueId = "";
    for (let i = 0; i < 3; i++)
        uniqueId += Math.random().toString().slice(2);
    return uniqueId;
}


/**
 * 
 * @param {*} n 
 * @param {*} digits 
 * @returns 
 */
export function zeroPad(n, digits) {
    return n.toString().padStart(digits, '0');
}


/**
 * 
 * @param {*} strDateTime 
 * @returns 
 */
export function getDateTimeUTCFromStr(strDateTime) {
    let [strDate, strTime] = strDateTime.split(" ");
    let day, month, year, hours, minutes;

    if (strDate)
        [day, month, year] = strDate
            .split(".");
    if (strTime)
        [hours, minutes] = strTime
            .split(":");

    let dateTimeUTC = new Date(
        `${year}-${month}-${day}T${hours}:${minutes}`
    ).toUTCString();

    if (dateTimeUTC == 'Invalid Date')
        throw ('getDateTimeUTCFromStr: error format strDateTime');
    return dateTimeUTC;
};


/**
 * 
 */
export function getDateTimeLocalFromUTCStr(strDateTimeUTC) {
    let localDateTime = new Date(strDateTimeUTC);
    return `${zeroPad(localDateTime.getDate(), 2)}.${zeroPad(localDateTime.getMonth(), 2)}.${localDateTime.getFullYear()} ${zeroPad(localDateTime.getHours(), 2)}:${zeroPad(localDateTime.getMinutes(), 2)}`
}