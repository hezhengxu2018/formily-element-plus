<script lang="ts" setup>
import { createForm } from '@formily/core'
import { ArrayField, Field } from '@formily/vue'
import { Checkbox, Form, FormItem, Submit } from '@sliver/formily-element-plus'

const form = createForm()

function onSubmit(value) {
  console.log(value)
}
</script>

<template>
  <Form :form="form">
    <Field
      name="single"
      title="是否确认"
      :decorator="[FormItem]"
      :component="[Checkbox]"
    />
    <ArrayField
      name="multiple"
      title="复选"
      :data-source="[
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ]"
      :decorator="[FormItem]"
      :component="[Checkbox.Group, { optionType: 'button' }]"
    >
      <template #default="{ option }">
        <div>通过插槽渲染的{{ option.label }}</div>
      </template>
    </ArrayField>
    <Submit @submit="onSubmit">
      提交
    </Submit>
  </Form>
</template>
