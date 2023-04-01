/*
 * File:        /src/app/utils.ts
 * Description:
 * Used by:
 * Dependency:
 *
 * Date        By     Comments
 * ----------  -----  ---------------------------------------------------------
 * 2023-03-12  C2RLO
 */

function date_TO_String(date_Object: Date): string {
  // get the year, month, date, hours, and minutes seprately and append to the string.
  const date_String: string =
    date_Object.getFullYear() +
    '/' +
    (date_Object.getMonth() + 1) +
    '/' +
    +date_Object.getDate() +
    ' ' +
    +date_Object.getHours() +
    ':' +
    +date_Object.getMinutes()
  return date_String
}

export function getDateString(): string {
  const new_date: Date = new Date()
  const date_string = date_TO_String(new_date)
  return date_string
}
