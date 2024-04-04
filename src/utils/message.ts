import {message} from "antd";

const warningMessageKey = 'warningMessageKey';
const successMessageKey = 'successMessageKey';
const errorMessageKey = 'errorMessageKey';

export const warning = (content = '数值格式错误') => {
  message.warning({
    content,
    duration: 1,
    key: warningMessageKey
  });
};

export const success = (content) => {
  message.success({
    content,
    duration: 1,
    key: successMessageKey
  });
};


export const error = (content) => {
  message.error({
    content,
    duration: 1,
    key: errorMessageKey
  });
};
