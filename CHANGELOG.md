# 更新日志



## [2.6.1](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.6.0...v2.6.1) (2025-07-24)


### Features

* **tree,tree-select:** 作用域插槽支持获取field ([93dfb5f](https://github.com/hezhengxu2018/formily-element-plus/commit/93dfb5fef9723e757eee70f87b24fae9cd8d9188))

# [2.6.0](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.7...v2.6.0) (2025-07-22)


### Bug Fixes

* **preview:** 修复tree及其他预览组件的attrs继承 ([bc63e56](https://github.com/hezhengxu2018/formily-element-plus/commit/bc63e566c10b75f0160417953ac5921d7407db20))


### Features

* **select-table:** 单选时支持高亮选中行 ([37dad1c](https://github.com/hezhengxu2018/formily-element-plus/commit/37dad1c4d37ed24c7206704873f858dfab04f68a))
* **tree,tree-select:** 添加对插槽的支持 ([2768124](https://github.com/hezhengxu2018/formily-element-plus/commit/276812434e4190bda69dca36b585e5d941c90148))
* **tree:** 完成tree组件开发及相关测试 ([84c1b80](https://github.com/hezhengxu2018/formily-element-plus/commit/84c1b80cc78ac9aee6071d6cb7d39d32b18c970b))
* **tree:** 树形组件支持阅读态 ([2382e77](https://github.com/hezhengxu2018/formily-element-plus/commit/2382e772f038835109ed7f30391b88fa49ac2c6d))

## [2.5.7](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.6...v2.5.7) (2025-07-14)


### Bug Fixes

* **form-dialog,form-drawer:** 修复添加抛错后成功提交时没有销毁DOM的错误 ([b9b56a5](https://github.com/hezhengxu2018/formily-element-plus/commit/b9b56a5477f8f748f1cacf2043958645923b0b95))

## [2.5.6](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.5...v2.5.6) (2025-07-10)


### Bug Fixes

* **editable:** 修复editable在禁用状态下交互异常的问题 ([5c89f16](https://github.com/hezhengxu2018/formily-element-plus/commit/5c89f163bd297c2bc7d1f63b640733e6a9b39a4e))

## [2.5.5](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.4...v2.5.5) (2025-07-04)


### Bug Fixes

* **form-drawer,form-dialog:** 修复没有通过confirm关闭弹框时没有抛出异常的错误 ([fe3a7fb](https://github.com/hezhengxu2018/formily-element-plus/commit/fe3a7fb1af5def95460de002cd0c72c9673ebba9))
* **form-item:** 修复文档中form-item错误的使用说明,之前通过插槽实现的功能现在统一使用VNode实现. ([c088d32](https://github.com/hezhengxu2018/formily-element-plus/commit/c088d32156669fe9b0c70c2b17880d04e9ba44db))
* **utils:** 修复通用转化的高阶组件函数attrs异常问题 ([0f9e5db](https://github.com/hezhengxu2018/formily-element-plus/commit/0f9e5dbdb754e4473659253edace2b2b025ce1c6))


### Features

* **array-list-tabs:** 新增将field作为tab标题的配置项 ([c3a52f1](https://github.com/hezhengxu2018/formily-element-plus/commit/c3a52f1e94ba3a80228b76b9b66afe3a8d86c5c6))

## [2.5.4](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.3...v2.5.4) (2025-06-24)


### Bug Fixes

* **array-base:** 修复array-base-addition组件样式问题 ([e9a2d3c](https://github.com/hezhengxu2018/formily-element-plus/commit/e9a2d3c25e8d683d485ffcc96d251aecb037161c))
* **array-base:** 修复不同组件中array-base-addition组件样式不一致的问题 ([97f3818](https://github.com/hezhengxu2018/formily-element-plus/commit/97f38189c3a16564301efcc4e9e4a940c21a817d))
* **pagination:** 修复分页组件无法正确读取语言的问题 ([7b363e9](https://github.com/hezhengxu2018/formily-element-plus/commit/7b363e971d4b92a3bbdec096e7edfb666ea4d8e6))

## [2.5.3](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.2...v2.5.3) (2025-06-16)


### Bug Fixes

* **form-item:** 修复form-item报错无法显示的问题 ([568ec46](https://github.com/hezhengxu2018/formily-element-plus/commit/568ec46e608d5944b329c20ae20898d3ecbcd364))


### Reverts

* **array-tabs:** 退回style的修改 ([08c44df](https://github.com/hezhengxu2018/formily-element-plus/commit/08c44dfd28794ddee62ad0d98466df99280d5f91))

## [2.5.2](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.1...v2.5.2) (2025-06-16)


### Bug Fixes

* **array-table:** 回滚仅有一页时隐藏的配置项 ([cf9fa11](https://github.com/hezhengxu2018/formily-element-plus/commit/cf9fa11002951de15291cc276bd344152ccee04f))
* **form-dialog,form-drawer:** 修复工具函数引起的驼峰转化不生效的问题 ([13a725d](https://github.com/hezhengxu2018/formily-element-plus/commit/13a725d84e937427570fbd6348b3fa3f80fc9568))
* **form-item:** 修复样式问题 ([76bea7b](https://github.com/hezhengxu2018/formily-element-plus/commit/76bea7b1493e5c70409d93cb02ba85554d13b4c4))
* **utils:** 修复无法继承style与class的bug ([7f4072a](https://github.com/hezhengxu2018/formily-element-plus/commit/7f4072a798609016d29a5d6d0edfa676b2341286))

## [2.5.1](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.5.0...v2.5.1) (2025-06-09)


### Bug Fixes

* **form-button-group:** 修复form id不存在时的渲染异常 ([bd0724e](https://github.com/hezhengxu2018/formily-element-plus/commit/bd0724e3f05fdd7ab6693f7df453e124bd9b4938))

# [2.5.0](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.4.2...v2.5.0) (2025-06-09)


### Bug Fixes

* **form-button-group:** 修复id以数字开头时选择器失效的问题 ([7df0237](https://github.com/hezhengxu2018/formily-element-plus/commit/7df02373c7e835d3ea7906b9c20f12eb72256ea1))
* **preview-text:** 修复预览组件的异常渲染问题 ([1d0cd9a](https://github.com/hezhengxu2018/formily-element-plus/commit/1d0cd9a1f554cfbe7f7512585102be928cc7e8e4))


### Features

* **form-button-group:** 新增黏性布局特性 ([0c9a0d8](https://github.com/hezhengxu2018/formily-element-plus/commit/0c9a0d8c6de07f11147bcb44df4d6c3286090979))

## [2.4.2](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.4.1...v2.4.2) (2025-06-07)


### Bug Fixes

* **array-collapse:** 修复手风琴模式异常的问题 ([7ae620c](https://github.com/hezhengxu2018/formily-element-plus/commit/7ae620c72322a6bb89bb4363c2409d5fdb2822ea))
* **array-collapse:** 修复样式异常导致的标题居中的问题 ([c0c3c87](https://github.com/hezhengxu2018/formily-element-plus/commit/c0c3c871d07b503ef021abc5d54adc61f5ffd29d))
* **array-items,input:** 修复继承属性异常的问题 ([1ca9bbc](https://github.com/hezhengxu2018/formily-element-plus/commit/1ca9bbc5f7978d6811a9bab86b3e8ff6597873df))
* **array-items:** 修复拖动条目后渲染异常的问题 ([aba51e8](https://github.com/hezhengxu2018/formily-element-plus/commit/aba51e883c9558be51b03163438c49032c73a2ec))
* **array-items:** 通过hack的方式修复了拖动后失去与vue响应式的bug ([e1b1507](https://github.com/hezhengxu2018/formily-element-plus/commit/e1b15073f855748f7b1d833b177c2e7b7af77950))
* **array-table:** 修复array-table配置项无法生效的问题 ([d4730e7](https://github.com/hezhengxu2018/formily-element-plus/commit/d4730e7c4b633c2d08ad05cecfb65fe3120f1720))
* **array-table:** 修复切换column显示无法生效的问题 ([3bc8203](https://github.com/hezhengxu2018/formily-element-plus/commit/3bc82036a0d9235dcd669c7d8f32606cd8fe53ae))
* **editable:** 修复editable切换过快导致el-select的change事件无法触发的问题 ([1073bd2](https://github.com/hezhengxu2018/formily-element-plus/commit/1073bd2d9a3ff91a62dfaef9cbe3783db9a422b3))
* **editable:** 修复editable组件无法校验表单的问题 ([91fafce](https://github.com/hezhengxu2018/formily-element-plus/commit/91fafceba0942179cfce2ead1a593fb7014106b0))
* **editable:** 修复editable组件继承属性异常的问题 ([53e4f5b](https://github.com/hezhengxu2018/formily-element-plus/commit/53e4f5bf46cc01aab66756f60524973926aac0fa))
* **editable:** 修复popover弹框提前关闭的bug ([84bd6c9](https://github.com/hezhengxu2018/formily-element-plus/commit/84bd6c9e2dc0de2107298eb359da43ffdb5a6eea))
* **editable:** 修复特殊情况下editable的readpretty属性缺失的问题 ([5057212](https://github.com/hezhengxu2018/formily-element-plus/commit/505721266a601726ebcf8c7df8d86212de2138e7))
* **form-dialog,form-drawer:** 默认插槽支持通过解构获取form实例 ([1a3f517](https://github.com/hezhengxu2018/formily-element-plus/commit/1a3f517b533f1557d2816104b6590885b83b192e))
* **form-item:** 修复form-item样式异常的问题 ([a357930](https://github.com/hezhengxu2018/formily-element-plus/commit/a357930d24fe0c22a4dc909c4c50b3f6d92b3e92))
* **form-item:** 修复样式异常 ([731a5d1](https://github.com/hezhengxu2018/formily-element-plus/commit/731a5d18538392966261eb65ed4643fc351beed0))
* **select-table:** 修复类型错误引起的不必要的必填参数 ([31f1801](https://github.com/hezhengxu2018/formily-element-plus/commit/31f180114300ed439bc7451ff099b9704b288dbc))
* 修复部分组件继承属性错误的问题 ([c9bbc34](https://github.com/hezhengxu2018/formily-element-plus/commit/c9bbc3408ad12770e782055200cc849037afdfc4))


### Features

* **array-base:** 通过schema渲染的array类型组件支持items渲染 ([77743c1](https://github.com/hezhengxu2018/formily-element-plus/commit/77743c13a929eec3e46efb6f1c1a9088ca47396c))
* **array-table:** array-table支持拖拽调整顺序 ([6f0324a](https://github.com/hezhengxu2018/formily-element-plus/commit/6f0324a7039c495c69cda50679f6b1888ad96871))
* **array-table:** array-table组件支持分页显示，分页上支持错误显示 ([6aa3146](https://github.com/hezhengxu2018/formily-element-plus/commit/6aa3146cab8751012826a0595ab24767e264478d))
* **array-table:** fork pagination from element-plus ([bfe627d](https://github.com/hezhengxu2018/formily-element-plus/commit/bfe627dadc026f6fad566a05535dce9d492f3e0a))
* **editable:** 支持通过editProps修改编辑状态下的属性值 ([5e36870](https://github.com/hezhengxu2018/formily-element-plus/commit/5e368704d341aef954adf1e743b2e53c4da836a7))
* **form-step:** 添加组件对插槽的支持 ([4a5bf20](https://github.com/hezhengxu2018/formily-element-plus/commit/4a5bf2030dbd51226231dfebeeb636bdc6cb5d62))
* **preview:** 日期选择的预览组件提供默认的格式 ([1d57d1b](https://github.com/hezhengxu2018/formily-element-plus/commit/1d57d1bcef0fc2277752d988979ae01184eb4463))

## [2.4.1](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.4.0...v2.4.1) (2025-04-22)


### Bug Fixes

* **form-layout:** 移除表单提交的默认行为 ([796fa0c](https://github.com/hezhengxu2018/formily-element-plus/commit/796fa0ca1b3cafa60d80f3abe02f2121d28f0241))


### Features

* **form-item:** 添加组件对插槽的支持 ([8154a51](https://github.com/hezhengxu2018/formily-element-plus/commit/8154a515c1fc7013bf0a5e791b1eeeb1b7914158))

# [2.4.0](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.3.1...v2.4.0) (2025-04-22)

## [2.3.1](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.3.0...v2.3.1) (2025-04-16)


### Bug Fixes

* **form-dialog,form-drawer:** 修复由于element-plus内置动画导致弹框关闭前的一小段时间仍然可以提交的bug ([a39a35b](https://github.com/hezhengxu2018/formily-element-plus/commit/a39a35b81d74b4d963eb255f0cf159d1598276a2))

# [2.3.0](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.2.2...v2.3.0) (2025-04-08)


### Bug Fixes

* **form-dialog:** 修复无法渲染普通组件的问题 ([de75045](https://github.com/hezhengxu2018/formily-element-plus/commit/de75045d4d02556441b828df60d21b6220e1fe99))
* **preview:** 修复preview组件继承配置失败的问题 ([bb673cc](https://github.com/hezhengxu2018/formily-element-plus/commit/bb673cc9284a87f57696408631d0ce41d679183a))


### Features

* **form-dialog:** formDialog支持插槽渲染即额外的自定义按钮 ([249be0c](https://github.com/hezhengxu2018/formily-element-plus/commit/249be0c8cc5b1bfcd0eefe22a1ceaad223f46da2))
* **form-dialog:** formDialog组件支持动态添加中间件 ([ced7c73](https://github.com/hezhengxu2018/formily-element-plus/commit/ced7c736402b5c7cda453c3bcf4b6ef18b481af9))
* **form-dialog:** 支持通过插槽的形式自定义渲染节点 ([9921bcc](https://github.com/hezhengxu2018/formily-element-plus/commit/9921bcc4e696a768a2419c7c8520588f320a045e))

## [2.2.2](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.2.1...v2.2.2) (2025-03-25)


### Bug Fixes

* **preview-text:** 修复类型错误 ([93f19af](https://github.com/hezhengxu2018/formily-element-plus/commit/93f19af02caaf1cd981dccb85daa1b10efeee7e4))
* **select:** 使用label作为select的key值 ([200da2d](https://github.com/hezhengxu2018/formily-element-plus/commit/200da2d20a516ef223496066ed1d62e15f46f1b7))
* **upload:** 添加对upload组件default插槽空数组的检查 ([6b67d1c](https://github.com/hezhengxu2018/formily-element-plus/commit/6b67d1c28dae09a384bc66e96e9dc7022d4458db))

## [2.2.1](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.2.0...v2.2.1) (2025-03-24)


### Bug Fixes

* **upload:** 移除上传失败时的field Error ([8c8e368](https://github.com/hezhengxu2018/formily-element-plus/commit/8c8e3682560e0afa542d0e59ab57bc84f55da01a))

# [2.2.0](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.1.0...v2.2.0) (2025-03-19)


### Bug Fixes

* **upload:** 修复组件封装事件冲突导致的事件触发异常 ([5cdbb1a](https://github.com/hezhengxu2018/formily-element-plus/commit/5cdbb1ab1cc7fcea4265ed6e384a66130c01396c))


### Features

* **upload:** upload组件新增formatValue配置项 ([d5bcc9c](https://github.com/hezhengxu2018/formily-element-plus/commit/d5bcc9c3f48793db739794c06ba6145a0d48a9bc))
* **upload:** upload组件新增获取实例的方法 ([56dad57](https://github.com/hezhengxu2018/formily-element-plus/commit/56dad57210d6dceef82611419dc707a194f980e3))

# Changelog

# [2.1.0](https://github.com/hezhengxu2018/formily-element-plus/compare/v2.0.1...v2.1.0) (2025-03-10)


### Bug Fixes

* **checkbox:** checkbox添加对低版本element-plus的兼容 ([5491570](https://github.com/hezhengxu2018/formily-element-plus/commit/5491570d8c0ca73a4fa19f73b884f03b28b165d4))
* **form:** 修复From组件中previewTextPlaceholder属性类型声明错误 ([89b5f79](https://github.com/hezhengxu2018/formily-element-plus/commit/89b5f791da33768695b77f9ea50b70369a2e6a88))
* **form:** 修复因移除没有在文档中描述的功能而无法使用QueryForm的问题 ([b87712c](https://github.com/hezhengxu2018/formily-element-plus/commit/b87712c13c898f3b9426f759922809d4d18defbe))


### Features

* **space:** 重新提供了space组件,只是简单的从对等依赖中再导出 ([2c288f4](https://github.com/hezhengxu2018/formily-element-plus/commit/2c288f46b823c05330429ee7585b8fce2c37a07b))

## 2.0.1 (2025-03-04)


### Bug Fixes

* **form-collapse:** 修复在没有提供title时组件无法正常渲染的错误 ([de9f492](https://github.com/hezhengxu2018/formily-element-plus/commit/de9f492fdf45c4c7795fa2d3079a18afa1f7735b))

## 2.0.0 (2025-03-03)


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
