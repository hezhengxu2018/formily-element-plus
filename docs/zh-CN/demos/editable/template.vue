<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormProvider, ObjectField, VoidField } from '@formily/vue'
import {
  DatePicker,
  Editable,
  FormButtonGroup,
  FormItem,
  Input,
  Submit,
} from '@sliver/formily-element-plus'

const form = createForm()

async function log(values) {
  console.log(values)
}
</script>

<template>
  <FormProvider :form="form">
    <Field
      name="date"
      title="日期"
      :decorator="[Editable]"
      :component="[DatePicker]"
    />
    <Field
      name="input"
      title="输入框"
      :decorator="[Editable]"
      :component="[Input]"
    />
    <VoidField
      name="void"
      title="虚拟节点容器"
      :component="[Editable.Popover]"
      :reactions="
        (field) => {
          field.title = field.query('.void.date2').get('value') || field.title
        }
      "
    >
      <Field
        name="date2"
        title="日期"
        :decorator="[FormItem]"
        :component="[DatePicker]"
      />
      <Field
        name="input2"
        title="输入框"
        :decorator="[FormItem]"
        :component="[Input]"
      />
    </VoidField>
    <ObjectField
      name="iobject"
      title="对象节点容器"
      :component="[Editable.Popover]"
      :reactions="
        (field) => {
          field.title = (field.value && field.value.date) || field.title
        }
      "
    >
      <Field
        name="date"
        title="日期"
        :decorator="[FormItem]"
        :component="[DatePicker]"
      />
      <Field
        name="input"
        title="输入框"
        :decorator="[FormItem]"
        :component="[Input]"
      />
    </ObjectField>
    <Field
      name="disabled"
      title="禁用"
      :decorator="[Editable]"
      :component="[Input]"
      initial-value="已经禁用的Editable"
      :disabled="true"
    />
    <FormButtonGroup>
      <Submit @submit="log">
        提交
      </Submit>
    </FormButtonGroup>
  </FormProvider>
</template>

<style lang="scss" scoped></style>
