# 项目介绍

- 本项目是基于 electron 开发的桌面应用，主要支持：
  - 管理待办事项
  - 记录日常笔记，
- 并内置提供常用工具箱，提高工作效率，包括：
  - 时间戳转换
  - 计算器
  - 加密工具
  - 颜色转换
  - 进制转换
  - 调色盘
  - 人民币大写转换器
  - UrlEncode 编解码
  - Base64 编解码
  - 英文格式转换
  - 随机密码生成器
  - 字数统计工具等。
- 使用 react 作为前端框架，使用 typescript 作为开发语言。
- 支持多平台打包，包括 Windows、MacOS、Linux。

# 环境准备

- node 版本：v20.11.1

# 开发参考

- [electron-forge react-with-typescript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

# 本地运行

```shell
yarn start
```

# 执行构建

```shell
yarn make
# export ELECTRON_MIRROR="https://registry.npmmirror.com/-/binary/electron/" && rm -rf out && yarn make
```
