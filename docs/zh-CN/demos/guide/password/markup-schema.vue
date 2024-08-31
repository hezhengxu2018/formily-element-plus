<script lang="ts" setup>
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import { FormItem, Password, Submit } from '@sliver/formily-element-plus'

const form = createForm()
const { SchemaField, SchemaStringField } = createSchemaField({
  components: {
    FormItem,
    Password,
  },
})

function log(value) {
  console.log(value)
}
</script>

<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaStringField
        name="password"
        title="密码框"
        x-decorator="FormItem"
        x-component="Password"
      />
    </SchemaField>
    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
