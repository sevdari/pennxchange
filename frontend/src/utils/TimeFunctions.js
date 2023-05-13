/**
 * Convert the timestamp to a string of '? days ago'
 * @param {*} timestamp the timestamp to convert, e.g. '2020-12-01T00:00:00.000Z'
 * @returns day difference, in string format '? days ago' or 'today'
 */
function dayDifference(timestamp) {
  const oneDay = 24 * 60 * 60 * 1000;
  // use Date to format current time and given time
  // result will in milliseconds
  const today = new Date().getTime();
  const otherDay = new Date(timestamp).getTime();
  const difference = Math.abs(today - otherDay);
  const dayDiff = Math.round(difference / oneDay);
  // special case: today / 1 day ago
  return dayDiff === 0 ? 'today' : `${dayDiff} day${dayDiff === 1 ? '' : 's'} ago`;
}

/**
 * Given a timestamp, return the string of the date in format 'Mon Dec 01 2020'
 * @param {*} timestamp the timestamp to convert, e.g., '2020-12-01T00:00:00.000Z'
 * @returns the string of the date, e.g. 'Mon Dec 01 2020'
 */
function getDateString(timestamp) {
  const date = new Date(timestamp);
  return date.toString();
}

export { dayDifference, getDateString };
