# 环境准备

- node 版本：v18.14.2

# 参考资料

- [electron-forge react-with-typescript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

# 本地运行

```shell
yarn start
```

# 执行构建

```shell
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
yarn make
```

# 待办事项

- [x] 增加 prettier 配置，增加代码自动格式化
- [x] 加入 react + typescript
- [x] 增加热更新
- [x] 使用 react 的新写法
- [x] 增加 normalize.css
- [x] 安装 redux 和 RTK， 自定义 store 相关的文件
- [x] 设置 src 别名

- [x] 增加 lodash 工具库
- [x] 增加 antd 组件库
- [x] 增加国际化支持 https://juejin.cn/post/6844904015654813703
- [ ] 自动指定项目所需要的 node 版本
- [x] 增加 react-router 的使用
- [ ] 连接 sql or nosql 数据库 选择 sqlite3
- [ ] 安装富文本编辑器 draft.js
- [x] import 自动排序
- [] mui https://mui.com/material-ui/react-slider/

- [ ] 完成待办界面的开发，可进行计划的管理
- [ ] appStore 发布 https://www.electronjs.org/zh/docs/latest/tutorial/mac-app-store-submission-guide
- [ ] 使用 tailwindcss: https://tailwindcss.com/docs/installation
