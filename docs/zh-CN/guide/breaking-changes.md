# 重大改动

## 打包方式重构

移除 `umd` 格式与 `cjs` 的打包打包产物，只保留 `esm` 格式的打包，随着前端技术的发展应该不再需要`cjs`的打包产物了，不排除之后会添加umd格式的打包产物。同时对依赖内scss进行编译，产物为css格式，不再依赖预处理器。目前项目的构建方式已完全迁移至`vite`，不再是之前简单的通过typescript编译的产物。

## Space

- 移除了 `Space` 组件的封装，直接使用了ElSpace。

> 从某个版本开始 `element-plus` 放弃了对老浏览器的支持，通过flex的gap属性来实现间距，导致在老浏览器上的显示效果受到了影响。

## Checkbox

- 新增通过作用域插槽渲染的方式。
- 统一使用新版的API，对相应的属性做了兼容，移除在使用时的warning信息。

## Radio

- 新增通过作用域插槽渲染的方式。
- 添加对移除Radio封装的说明。
- 统一使用新版的API，对相应的属性做了兼容，移除在使用时的warning信息。

## ArrayTabs

- 修复无法关闭Tab页的问题。

## FormDialog

- 修复通过protalId传入上下文时无法打开对话框的问题。
- 现在表单校验失败时不会作为错误终止FormDialog的Promise状态，仅取消和关闭会将整个Promise作为reject抛出，方便进行函数式编程。

## FormDrawer

- 修复通过protalId传入上下文时无法打开对话框的问题。
- 现在表单校验失败时不会作为错误终止FormDrawer的Promise状态，仅取消和关闭会将整个Promise作为reject抛出，方便进行函数式编程。
