# Radio

> 单选框

::: warning 注意
你永远都应该使用`Radio.Group`而不是`Radio`，本组件实际上并未对`Radio`进行封装。是原始的`ElRadio`组件。新版`ElRadio`的入参value会和Field的入参冲突，想要兼容就必须对入参进行额外的包裹，带来不必要的复杂度。而且对于表单而言应该没有单独使用的场景，额外的封装显得有些多余。
:::

## Markup Schema 案例

:::demo

radio/markup-schema

:::

## JSON Schema 案例

:::demo

radio/json-schema

:::

## Template 案例

:::demo

radio/template

:::

## API

参考 [https://cn.element-plus.org/zh-CN/component/radio.html](https://cn.element-plus.org/zh-CN/component/radio.html)

### 扩展属性

| 属性名     | 类型                                                                                              | 描述     | 默认值  |
| ---------- | ------------------------------------------------------------------------------------------------- | -------- | ------- |
| options    | [RadioProps](https://cn.element-plus.org/zh-CN/component/radio.html#radio-%E5%B1%9E%E6%80%A7)[] | 选项     | []      |
| optionType | default/button                                                                                    | 样式类型 | default |
