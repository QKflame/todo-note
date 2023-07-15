import dayjs from 'dayjs';
import React from 'react';

export const convertTimestampToDuration = (timestamp: number) => {
  const monthDiff = dayjs().diff(dayjs(timestamp), 'month');
  if (monthDiff > 0) {
    return formatTimestamp(timestamp);
  }

  const weekDiff = dayjs().diff(dayjs(timestamp), 'week');
  if (weekDiff > 0) {
    return `${weekDiff} 周前`;
  }

  const dayDiff = dayjs().diff(dayjs(timestamp), 'day');

  if (dayDiff > 0) {
    return `${dayDiff} 天前`;
  }

  const hourDiff = dayjs().diff(dayjs(timestamp), 'hour');
  if (hourDiff > 0) {
    return `${hourDiff} 小时前`;
  }

  const minuteDiff = dayjs().diff(dayjs(timestamp), 'minute');
  if (minuteDiff > 0) {
    return `${minuteDiff} 分钟前`;
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

export function convertGroupList(groups, currentGroupId) {
  const fn = (group) => {
    const {id, ...rest} = group;
    const newObj = {
      ...rest,
      value: id,
      ...(id === currentGroupId ? {disabled: true} : {})
    };
    if (group.children && group.children.length > 0) {
      newObj.children = group.children.map(fn);
    }
    return newObj;
  };

  const _groups = groups.map(fn);
  _groups.unshift({
    value: '-1',
    title: '近期待办',
    ...('-1' === currentGroupId ? {disabled: true} : {})
  });
  return _groups;
}

// 格式化截止时间
export function formatTodoDeadline(timestamp: null | number) {
  if (!timestamp) {
    return '未设置';
  }
  const currentTimestamp = Date.now();
  const difference = timestamp - currentTimestamp;

  if (difference > 0) {
    const remainingDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (remainingDays >= 1) {
      return <span style={{color: '#1677ff'}}>剩余 {remainingDays} 天</span>;
    }

    const remainingHours = Math.floor(difference / (1000 * 60 * 60));
    if (remainingHours >= 1) {
      return (
        <span style={{color: '#fa8c16'}}>剩余 {remainingHours} 小时</span>
      );
    }

    const remainingMinutes = Math.floor(difference / (1000 * 60));
    return (
      <span style={{color: '#fa8c16'}}>剩余 {remainingMinutes} 分钟</span>
    );
  }
  const expiredDays = Math.ceil(Math.abs(difference) / (1000 * 60 * 60 * 24));
  return <span style={{color: '#f5222d'}}>过期 {expiredDays} 天</span>;
}
