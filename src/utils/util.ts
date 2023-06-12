export const convertTimestampToDuration = (timestamp: number) => {
  if (!timestamp) {
    return '-';
  }

  const minuteUnit = 60;
  const hourUnit = 60 * minuteUnit;
  const dayUnit = 24 * hourUnit;

  timestamp = Math.floor(timestamp / 1000);

  const day = Math.floor(timestamp / dayUnit);

  if (day === 1) {
    return '昨天';
  }

  if (day === 2) {
    return '前天';
  }

  if (day > 2 && day < 7) {
    return `${day}天前`;
  }

  if (day >= 7 && day < 7 * 4) {
    return `${Math.floor(day / 7)}周前`;
  }
};
