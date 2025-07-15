# Tree

> 树形控件选择

::: warning 注意
目前控件不支持懒加载，想要支持懒加载则必须让后端在返回子节点的同时返回其所有的子节点状态是勾选半勾选还是不勾选的，这无疑加大了后端的负载。而且和很多的`valueType`是冲突的，比如`child`或者`path`如果在还没加载完子节点的情况下勾选了则需要向后端查询其所有的子节点来保证最后提交数据是正确的。在处理返显时的逻辑更为复杂，需要后端提供额外的接口来获取勾选操作时未加载的节点状态。
:::

::: warning 注意
请自行保证初始值的正确性，返显的`valueType`和提交的`valueType`必须保持一致。
:::

## Template 案例

::: demo

tree/template

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

### 扩展属性

| 属性名              | 类型                                            | 描述                                                 | 默认值  |
| ------------------- | ----------------------------------------------  | ---------------------------------------------------- | ------- |
| nodeKey             | `string`                                        | 节点的唯一标识符，现在是没有默认值的必填项           | -       |
| valueType           | ^[enum]`'all' \| 'parent' \| 'child' \| 'path'` | 数据类型，仅在`checkStrictly`为`false`生效           | `'all'` |
| includeHalfChecked  | `boolean`                                       | 是否包含半勾选的节点，仅在`valueType`为`'all'`时生效 | `false` |
| optionAsValue       | `boolean`                                       | 是否将节点值作为选项的值，`valueType`为`path`时无效  | `false` |
| optionFormatter     | `(node: TreeNode) => TreeNode`                  | 选项格式化函数，仅在`optionAsValue`为`true`时生效    | -       |
| height              | `number`                                        | 树的高度，唯一会添加给外部ElScorller的属性           | -       |

参考 [https://cn.element-plus.org/zh-CN/component/tree.html](https://cn.element-plus.org/zh-CN/component/tree.html)
