<script setup lang="ts">
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import { Form, FormItem, Input, Submit } from '@sliver/formily-element-plus'

const schema = {
  type: 'object',
  properties: {
    input: {
      'type': 'string',
      'title': '输入框',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}

const form = createForm()
const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})

async function onSubmit(value) {
  console.log(value)
}
</script>

<template>
  <Form :form="form">
    <SchemaField :schema="schema" />
    <Submit @submit="onSubmit">
      提交
    </Submit>
  </Form>
</template>
