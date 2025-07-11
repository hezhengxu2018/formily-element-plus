# Tree

> 树形控件选择

::: warning 注意
当`valueType`是`path`时，组件会无视`optionAsValue`的设置，始终返回完整路径；
:::

## Template 案例

::: demo

tree/template

:::

## Template 懒加载案例

::: warning 注意
懒加载只有一种可用的情况，即启用了`includeHalfChecked`，且`valueType`为`all`,同时配置了`isLeaf`属性。因为在其他情况下无法判断一个尚未加载出来的节点下是否有已经勾选的子节点，无法正常显示半勾选的树。其他的组合下如果配置了初始值需要返显，则会出现没点开子节点时未勾选，加载完成后突然勾选的诡异交互。
:::

::: demo

tree/template-lazy-load

:::

## Template 初始值返显案例

::: demo

tree/template-initial-value

:::

## Template option 初始值返显案例

::: demo

tree/template-option-initial-value

:::

## API

参考 [https://cn.element-plus.org/zh-CN/component/tree.html](https://cn.element-plus.org/zh-CN/component/tree.html)
