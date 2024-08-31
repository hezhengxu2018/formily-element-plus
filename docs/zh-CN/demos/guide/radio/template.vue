<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, Radio, Submit } from '@sliver/formily-element-plus'

const form = createForm()

function log(value) {
  console.log(value)
}
</script>

<template>
  <FormProvider :form="form">
    <Field
      name="input"
      title="单选"
      :decorator="[FormItem]"
      :component="[Radio.Group]"
      :data-source="[
        {
          label: '选项1',
          value: 1,
        },
        {
          label: '选项2',
          value: 2,
        },
      ]"
    />
    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
