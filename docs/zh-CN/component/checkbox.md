# Checkbox

> 复选框

::: warning 注意
使用本组件有一个前提，即`Checkbox.Group`内没有使用插槽的需求。`Checkbox`组件会跳过一层插槽直接将插槽渲染在`Checkbox`组件上，具体使用请参考下面的案例。
:::

::: tip 提示
element-plus 从`2.6.0`开始提供了新的属性，`label`作为`value`已经被废弃。请根据自己项目所使用的element-plus版本来决定dataSource数组里的对象的属性。使用旧版的API很难避免不使用插槽。
:::

## Markup Schema 案例

:::demo

checkbox/markup-schema

:::

## Markup Schema 使用插槽案例

:::demo

checkbox/markup-schema-slot

:::

## JSON Schema 案例

:::demo

checkbox/json-schema

:::

## Template 案例

:::demo

checkbox/template

:::

## API

参考 [https://cn.element-plus.org/zh-CN/component/checkbox.html](https://cn.element-plus.org/zh-CN/component/checkbox.html)

### 扩展属性

| 属性名      | 类型                            | 描述    | 默认值       |
| ---        | ---                            | ---     | ---         |
| optionType | ^[enum]`'default' \| 'button'` | 样式类型 | `'default'` |

## Checkbox Slot

| 插槽名   | 说明                           | 类型                  |
| ---     | ---                           | ---                   |
| default | 自定义每个选项渲染方式的作用域插槽 | ^[object]`{ option }` |
