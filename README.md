# 环境准备

- node 版本：v18.14.2

# 参考资料

- [electron-forge react-with-typescript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

# 本地运行

```shell
npm run start
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

# 集成数据库

选择 sqlite 还是 realm ?

npm 包使用 sqlite3 还是 better-sqlite

如何在 electron 中使用 sqlite

sqlite 官网：https://sqlite.org/index.html

相关的学习文章：

- https://fmacedoo.medium.com/standalone-application-with-electron-react-and-sqlite-stack-9536a8b5a7b9

Better-sqlite npm 包文档：

- https://www.npmjs.com/package/better-sqlite3

# 接口梳理

## 计划相关 Plan

### 获取计划列表 getPlanList

| 字段名     | 字段含义    | 字段类型 | 允许为 null | 默认值 |
| ---------- | ----------- | -------- | ----------- | ------ |
| id         | 计划 Id     |          |             |        |
| name       | 计划名称    |          |             |        |
| parentId   | 父级 ID     |          |             |        |
| planId     | 所属计划 ID |          |             |        |
| createTime | 创建时间    |          |             |        |
| updateTime | 修改时间    |          |             |        |
| deleteTime | 删除时间    |          |             |        |
| priority   | 优先级      |          |             |        |
| progress   | 进度        |          |             |        |

```
1,测试,1,1686442565367,1686442565367,
2,测试,1,1686442565367,1686442565367,
3,测试,1,1686442565367,1686442565367,
4,测试,1,1686442565367,1686442565367,
5,测试,1,1686442565367,1686442565367,
6,测试,1,1686442565367,1686442565367,
7,测试,1,1686442565367,1686442565367,
8,测试,1,1686442565367,1686442565367,
9,测试,1,1686442565367,1686442565367,
10,测试,1,1686442565367,1686442565367,
```

## 待办相关 Todo

### 获取待办列表 getTodoList

## 笔记相关 Note
