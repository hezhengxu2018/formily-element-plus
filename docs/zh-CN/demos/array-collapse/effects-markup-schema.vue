<script lang="ts" setup>
import { createForm, onFieldChange, onFieldReact } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { ArrayCollapse, FormItem, Input, Submit } from '@sliver/formily-element-plus'

const {
  SchemaField,
  SchemaArrayField,
  SchemaObjectField,
  SchemaVoidField,
  SchemaStringField,
} = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayCollapse,
  },
})

const form = createForm({
  effects: () => {
    // 主动联动模式
    onFieldChange('array.*.aa', ['value'], (field, form) => {
      form.setFieldState(field.query('.bb'), (state) => {
        state.visible = field.value !== '123'
      })
    })
    // 被动联动模式
    onFieldReact('array.*.dd', (field) => {
      field.visible = field.query('.cc').get('value') !== '123'
    })
  },
})

async function log(values) {
  console.log(values)
}
</script>

<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaArrayField
        name="array"
        :max-items="3"
        x-component="ArrayCollapse"
        x-decorator="FormItem"
        :x-component-props="{
          title: '对象数组',
        }"
      >
        <SchemaObjectField
          x-component="ArrayCollapse.Item"
          x-decorator="FormItem"
          :x-component-props="{
            title: '对象数组',
          }"
        >
          <SchemaVoidField x-component="ArrayCollapse.Index" />
          <SchemaStringField
            name="aa"
            x-decorator="FormItem"
            title="AA"
            required
            description="AA输入123时隐藏BB"
            x-component="Input"
          />
          <SchemaStringField
            name="bb"
            x-decorator="FormItem"
            title="BB"
            required
            x-component="Input"
          />
          <SchemaStringField
            name="cc"
            x-decorator="FormItem"
            title="CC"
            required
            description="CC输入123时隐藏DD"
            x-component="Input"
          />
          <SchemaStringField
            name="dd"
            x-decorator="FormItem"
            title="DD"
            required
            x-component="Input"
          />
          <SchemaVoidField x-component="ArrayCollapse.Remove" />
          <SchemaVoidField x-component="ArrayCollapse.MoveUp" />
          <SchemaVoidField x-component="ArrayCollapse.MoveDown" />
        </SchemaObjectField>
        <SchemaVoidField
          x-component="ArrayCollapse.Addition"
          title="添加条目"
        />
      </SchemaArrayField>
    </SchemaField>
    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>

<style lang="scss" scoped></style>
