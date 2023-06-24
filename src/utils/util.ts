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

export function findObjectById(tree, id) {
  if (!tree || !Array.isArray(tree)) {
    return null;
  }

  for (const obj of tree) {
    if (obj.id === id) {
      return obj;
    }

    if (obj.children && obj.children.length > 0) {
      const foundObject = findObjectById(obj.children, id);
      if (foundObject) {
        return foundObject;
      }
    }
  }

  return null;
}

export function convertPlanList(plans, currentPlanId) {
  const fn = (plan) => {
    const {id, ...rest} = plan;
    const newObj = {
      ...rest,
      value: id,
      ...(id === currentPlanId ? {disabled: true} : {})
    };
    if (plan.children && plan.children.length > 0) {
      newObj.children = plan.children.map(fn);
    }
    return newObj;
  };

  const _plans = plans.map(fn);
  _plans.unshift({
    value: '-1',
    title: '近期待办',
    ...('-1' === currentPlanId ? {disabled: true} : {})
  });
  return _plans;
}
