# Changelog

## 2.0.1 (2025-03-04)


### Bug Fixes

* **array-base:** 修复array类型的添加按钮样式反馈 ([b1abfd7](https://github.com/hezhengxu2018/formily-element-plus/commit/b1abfd7a22818f15021b3cb4c7c7cd8eed25c581))
* **array-base:** 修复由于props覆盖引起的class无法正常添加导致的样式问题,修复array操作控件间距异常的问题 ([82f94fa](https://github.com/hezhengxu2018/formily-element-plus/commit/82f94fabaeefbae2a53ad80df55287d8b3fcdd1f))
* **array-list-tabs:** 添加组件对a11y的支持 ([30ef033](https://github.com/hezhengxu2018/formily-element-plus/commit/30ef033ed93bb4b6b70fc17d7f826febfb4a36f1))
* **array-list-tabs:** 移除el-card的使用 ([05a251b](https://github.com/hezhengxu2018/formily-element-plus/commit/05a251b8ad18016c9ba1cb58865c5402689d9366))
* **array-table,array-item:** 修复依赖版本引起的问题及由此导致的样式异常 ([233a649](https://github.com/hezhengxu2018/formily-element-plus/commit/233a649c27bc7094155615a2030203083abd12cc))
* **array-table:** 添加对表格加载状态的支持 ([a736369](https://github.com/hezhengxu2018/formily-element-plus/commit/a7363694618b0a6f6bd9688c8910ad85849f192f))
* **checkbox:** 修复checkbox入参不生效的问题 ([2e40381](https://github.com/hezhengxu2018/formily-element-plus/commit/2e4038110c1c5eafaf6292989050d22b3ecf3568))
* **checkbox:** 修复checkbox的控制台warning信息 ([89a2f11](https://github.com/hezhengxu2018/formily-element-plus/commit/89a2f1160967af6cd1f3b42b91c8169ace1d207e))
* **checkbox:** 修复不同版本element-plus之间由于参数不一致而引起的渲染异常 ([05e2e53](https://github.com/hezhengxu2018/formily-element-plus/commit/05e2e53f9d9c5e20082947a401e62981ab7ff31b))
* **docs/sidebar:** 配置侧边栏主题色及文档logo ([7c82ec6](https://github.com/hezhengxu2018/formily-element-plus/commit/7c82ec6f6299431c68647b7097994bed747c35b9))
* **docs:** 添加侧边栏 ([abee5a3](https://github.com/hezhengxu2018/formily-element-plus/commit/abee5a37e792f05a8273ddcf56afdc510bab4271))
* **editable,radio:** 修复editable及radio样式问题 ([e1f57ca](https://github.com/hezhengxu2018/formily-element-plus/commit/e1f57caa1600021ec18c720b7eea9db652316dd7))
* **form-collapse:** 修复在没有提供title时组件无法正常渲染的错误 ([de9f492](https://github.com/hezhengxu2018/formily-element-plus/commit/de9f492fdf45c4c7795fa2d3079a18afa1f7735b))
* **form-dialog,form-drawer:** 简化打包脚本，修复dialog及drawer无法获取上下文的错误 ([9d1ce10](https://github.com/hezhengxu2018/formily-element-plus/commit/9d1ce10c74ad7a2171c854b69d601363f421c5f7))
* **form-drawer,form-dialog:** 修复z-index无法正常使用默认值的问题 ([d6ff623](https://github.com/hezhengxu2018/formily-element-plus/commit/d6ff6232e95528422b7187aff87542e6fb4f37b7))
* **form-drawer:** 修复form-drawer提交表单没有读取loading状态导致可以重复提交表单的错误 ([093a6e6](https://github.com/hezhengxu2018/formily-element-plus/commit/093a6e6667da25508e0d39221b08d1f0c3c92f14))
* **index:** 添加select-table的导出 ([6c9b76a](https://github.com/hezhengxu2018/formily-element-plus/commit/6c9b76aead5d880aee92a6c624db3b8fb17c71c7))
* **select-table:** 修复select-table交互异常及数据反显异常 ([b9dc0cd](https://github.com/hezhengxu2018/formily-element-plus/commit/b9dc0cd44fe93ccf9da1ee615574409c88b7f6ea))
* **select-table:** 添加对低版本element-plus单选框属性值的兼容 ([59b5737](https://github.com/hezhengxu2018/formily-element-plus/commit/59b5737b729357983372d8bf14e001ab1f58ae77))


### Features

* **array-list-tabs:** 新增array-list-tabs组件 ([fe0294a](https://github.com/hezhengxu2018/formily-element-plus/commit/fe0294a812eca8547528299217e18cd12895f773))
* **array-list-tabs:** 添加完善aria支持 ([6f69a7b](https://github.com/hezhengxu2018/formily-element-plus/commit/6f69a7ba5380544821022f8cee29f91d1b710c01))
* **docs:** 优化文档网站 ([68bce16](https://github.com/hezhengxu2018/formily-element-plus/commit/68bce166f16ed0754980f2ee6877e5be86c38d1c))
* **docs:** 初始化文档网站 ([00898c2](https://github.com/hezhengxu2018/formily-element-plus/commit/00898c2d4baf55707459d0e024dc2cecec8e1da1))
* **docs:** 添加组件预览及代码展示的功能 ([da54720](https://github.com/hezhengxu2018/formily-element-plus/commit/da5472001348f8662614043ec070827c9a8dccfc))
* select-table ([9d231fd](https://github.com/hezhengxu2018/formily-element-plus/commit/9d231fdd619b9a8d17da5b5d2c7caab44b358efb))
* select-table ([aea989c](https://github.com/hezhengxu2018/formily-element-plus/commit/aea989c33de280335465b5457433e3f2ece0589a))
* **select-table:** select-table新增alert bar ([c791158](https://github.com/hezhengxu2018/formily-element-plus/commit/c7911588b737471760ae6bdc9a7bf48ab75b46a9))
* **select-table:** 完成select-table基础功能开发 ([d2febf4](https://github.com/hezhengxu2018/formily-element-plus/commit/d2febf4f32a9cf8f0d12b2b1abb5b3a66dff2a57))
* **space:** 移除space组件 ([f761f7f](https://github.com/hezhengxu2018/formily-element-plus/commit/f761f7fc26b75654fdde8511fbd8b7562a6e0090))
* **src:** 初始化代码迁移 ([713bd68](https://github.com/hezhengxu2018/formily-element-plus/commit/713bd688355f644db74073f5717a2f72cdd0e729))
* **time-select:** 新增时间选择组件 ([d8874c6](https://github.com/hezhengxu2018/formily-element-plus/commit/d8874c6af47159e23eb7e1e5a390469da0ed7d0e))


### BREAKING CHANGES

* **space:** 移除space组件

# 2.0.0 (2025-03-03)


### Bug Fixes

* **array-base:** 修复由于props覆盖引起的class无法正常添加导致的样式问题,修复array操作控件间距异常的问题 ([82f94fa](https://github.com/hezhengxu2018/formily-element-plus/commit/82f94fabaeefbae2a53ad80df55287d8b3fcdd1f))
* **array-base:** 修复array类型的添加按钮样式反馈 ([b1abfd7](https://github.com/hezhengxu2018/formily-element-plus/commit/b1abfd7a22818f15021b3cb4c7c7cd8eed25c581))
* **array-list-tabs:** 添加组件对a11y的支持 ([30ef033](https://github.com/hezhengxu2018/formily-element-plus/commit/30ef033ed93bb4b6b70fc17d7f826febfb4a36f1))
* **array-list-tabs:** 移除el-card的使用 ([05a251b](https://github.com/hezhengxu2018/formily-element-plus/commit/05a251b8ad18016c9ba1cb58865c5402689d9366))
* **array-table,array-item:** 修复依赖版本引起的问题及由此导致的样式异常 ([233a649](https://github.com/hezhengxu2018/formily-element-plus/commit/233a649c27bc7094155615a2030203083abd12cc))
* **array-table:** 添加对表格加载状态的支持 ([a736369](https://github.com/hezhengxu2018/formily-element-plus/commit/a7363694618b0a6f6bd9688c8910ad85849f192f))
* **checkbox:** 修复不同版本element-plus之间由于参数不一致而引起的渲染异常 ([05e2e53](https://github.com/hezhengxu2018/formily-element-plus/commit/05e2e53f9d9c5e20082947a401e62981ab7ff31b))
* **checkbox:** 修复checkbox的控制台warning信息 ([89a2f11](https://github.com/hezhengxu2018/formily-element-plus/commit/89a2f1160967af6cd1f3b42b91c8169ace1d207e))
* **checkbox:** 修复checkbox入参不生效的问题 ([2e40381](https://github.com/hezhengxu2018/formily-element-plus/commit/2e4038110c1c5eafaf6292989050d22b3ecf3568))
* **docs/sidebar:** 配置侧边栏主题色及文档logo ([7c82ec6](https://github.com/hezhengxu2018/formily-element-plus/commit/7c82ec6f6299431c68647b7097994bed747c35b9))
* **docs:** 添加侧边栏 ([abee5a3](https://github.com/hezhengxu2018/formily-element-plus/commit/abee5a37e792f05a8273ddcf56afdc510bab4271))
* **editable,radio:** 修复editable及radio样式问题 ([e1f57ca](https://github.com/hezhengxu2018/formily-element-plus/commit/e1f57caa1600021ec18c720b7eea9db652316dd7))
* **form-dialog,form-drawer:** 简化打包脚本，修复dialog及drawer无法获取上下文的错误 ([9d1ce10](https://github.com/hezhengxu2018/formily-element-plus/commit/9d1ce10c74ad7a2171c854b69d601363f421c5f7))
* **form-drawer,form-dialog:** 修复z-index无法正常使用默认值的问题 ([d6ff623](https://github.com/hezhengxu2018/formily-element-plus/commit/d6ff6232e95528422b7187aff87542e6fb4f37b7))
* **form-drawer:** 修复form-drawer提交表单没有读取loading状态导致可以重复提交表单的错误 ([093a6e6](https://github.com/hezhengxu2018/formily-element-plus/commit/093a6e6667da25508e0d39221b08d1f0c3c92f14))
* **index:** 添加select-table的导出 ([6c9b76a](https://github.com/hezhengxu2018/formily-element-plus/commit/6c9b76aead5d880aee92a6c624db3b8fb17c71c7))
* **select-table:** 添加对低版本element-plus单选框属性值的兼容 ([59b5737](https://github.com/hezhengxu2018/formily-element-plus/commit/59b5737b729357983372d8bf14e001ab1f58ae77))
* **select-table:** 修复select-table交互异常及数据反显异常 ([b9dc0cd](https://github.com/hezhengxu2018/formily-element-plus/commit/b9dc0cd44fe93ccf9da1ee615574409c88b7f6ea))


### Features

* **array-list-tabs:** 添加完善aria支持 ([6f69a7b](https://github.com/hezhengxu2018/formily-element-plus/commit/6f69a7ba5380544821022f8cee29f91d1b710c01))
* **array-list-tabs:** 新增array-list-tabs组件 ([fe0294a](https://github.com/hezhengxu2018/formily-element-plus/commit/fe0294a812eca8547528299217e18cd12895f773))
* **docs:** 初始化文档网站 ([00898c2](https://github.com/hezhengxu2018/formily-element-plus/commit/00898c2d4baf55707459d0e024dc2cecec8e1da1))
* **docs:** 添加组件预览及代码展示的功能 ([da54720](https://github.com/hezhengxu2018/formily-element-plus/commit/da5472001348f8662614043ec070827c9a8dccfc))
* **docs:** 优化文档网站 ([68bce16](https://github.com/hezhengxu2018/formily-element-plus/commit/68bce166f16ed0754980f2ee6877e5be86c38d1c))
* select-table ([9d231fd](https://github.com/hezhengxu2018/formily-element-plus/commit/9d231fdd619b9a8d17da5b5d2c7caab44b358efb))
* select-table ([aea989c](https://github.com/hezhengxu2018/formily-element-plus/commit/aea989c33de280335465b5457433e3f2ece0589a))
* **select-table:** 完成select-table基础功能开发 ([d2febf4](https://github.com/hezhengxu2018/formily-element-plus/commit/d2febf4f32a9cf8f0d12b2b1abb5b3a66dff2a57))
* **select-table:** select-table新增alert bar ([c791158](https://github.com/hezhengxu2018/formily-element-plus/commit/c7911588b737471760ae6bdc9a7bf48ab75b46a9))
* **space:** 移除space组件 ([f761f7f](https://github.com/hezhengxu2018/formily-element-plus/commit/f761f7fc26b75654fdde8511fbd8b7562a6e0090))
* **src:** 初始化代码迁移 ([713bd68](https://github.com/hezhengxu2018/formily-element-plus/commit/713bd688355f644db74073f5717a2f72cdd0e729))
* **time-select:** 新增时间选择组件 ([d8874c6](https://github.com/hezhengxu2018/formily-element-plus/commit/d8874c6af47159e23eb7e1e5a390469da0ed7d0e))


### BREAKING CHANGES

* **space:** 移除space组件
