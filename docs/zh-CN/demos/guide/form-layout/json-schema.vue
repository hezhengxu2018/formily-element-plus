<script setup lang="ts">
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import {
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@sliver/formily-element-plus'

const schema = {
  type: 'object',
  properties: {
    layout: {
      'type': 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 10,
        layout: 'vertical',
      },
      'properties': {
        input: {
          'type': 'string',
          'title': '输入框',
          'required': true,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: '123',
          },
          'x-component': 'Input',
        },
        select: {
          'type': 'string',
          'title': '选择框',
          'required': true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
      },
    },
  },
}

const form = createForm()
const { SchemaField } = createSchemaField({
  components: {
    FormLayout,
    FormItem,
    Input,
    Select,
  },
})
</script>

<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
  </FormProvider>
</template>
