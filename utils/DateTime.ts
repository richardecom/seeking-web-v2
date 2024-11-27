// export const getDateTime = (): string => {
//     return new Intl.DateTimeFormat('en-PH', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//       timeZone: 'Asia/Manila',
//     }).format(new Date()).replace(/[\/:]/g, '_');
//   };

export const getDateTime = (): string => {
  // Get the formatted date and time
  const formattedDateTime = new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Manila',
  }).format(new Date());
  const [date, time] = formattedDateTime.split(', ');
  const [year, month, day] = date.split('/');
  const [hour, minute, second] = time.split(':');
  return `_DATE_${year}_${month}_${day}_TIME_${hour}_${minute}_${second}`;
};