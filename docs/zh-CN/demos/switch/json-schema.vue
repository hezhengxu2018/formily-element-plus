<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import { Form, FormItem, Submit, Switch } from '@sliver/formily-element-plus'

const schema = {
  type: 'object',
  properties: {
    switch: {
      'type': 'boolean',
      'title': '开关',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
}

const form = createForm()
const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Switch,
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
