import dayjs from 'dayjs';

export const convertTimestampToDuration = (timestamp: number) => {
  const monthDiff = dayjs().diff(dayjs(timestamp), 'month');
  if (monthDiff > 0) {
    return formatTimestamp(timestamp);
  }

  const weekDiff = dayjs().diff(dayjs(timestamp), 'week');
  if (weekDiff > 0) {
    return `${weekDiff}周前`;
  }

  const dayDiff = dayjs().diff(dayjs(timestamp), 'day');

  if (dayDiff > 0) {
    return `${dayDiff}天前`;
  }

  const hourDiff = dayjs().diff(dayjs(timestamp), 'hour');
  if (hourDiff > 0) {
    return `${hourDiff}小时前`;
  }

  const minuteDiff = dayjs().diff(dayjs(timestamp), 'minute');
  if (minuteDiff > 0) {
    return `${minuteDiff}分钟前`;
  }

  return '刚刚';
};

/** 格式化时间戳 */
export function formatTimestamp(timestamp: number) {
  return dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss');
}

export function buildTree(array, parentId = null) {
  const tree = [];
  for (const item of array) {
    if (item.parentId === parentId) {
      const children = buildTree(array, item.id);
      if (children.length) {
        item.children = children;
      }
      tree.push(item);
    }
  }
  return tree;
}
