<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { ArrayCollapse, FormItem, Input, Submit } from '@sliver/formily-element-plus'

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayCollapse,
  },
})

const form = createForm()
const schema = {
  type: 'object',
  properties: {
    string_array: {
      'type': 'array',
      'x-component': 'ArrayCollapse',
      'maxItems': 3,
      'x-decorator': 'FormItem',
      'items': {
        'type': 'object',
        'x-component': 'ArrayCollapse.Item',
        'x-component-props': {
          title: '字符串数组',
        },
        'properties': {
          index: {
            'type': 'void',
            'x-component': 'ArrayCollapse.Index',
          },
          input: {
            'type': 'string',
            'x-decorator': 'FormItem',
            'title': 'Input',
            'required': true,
            'x-component': 'Input',
          },
          remove: {
            'type': 'void',
            'x-component': 'ArrayCollapse.Remove',
          },
          moveUp: {
            'type': 'void',
            'x-component': 'ArrayCollapse.MoveUp',
          },
          moveDown: {
            'type': 'void',
            'x-component': 'ArrayCollapse.MoveDown',
          },
        },
      },
      'properties': {
        addition: {
          'type': 'void',
          'title': '添加条目',
          'x-component': 'ArrayCollapse.Addition',
        },
      },
    },
    array: {
      'type': 'array',
      'x-component': 'ArrayCollapse',
      'maxItems': 3,
      'x-decorator': 'FormItem',
      'items': {
        'type': 'object',
        'x-component': 'ArrayCollapse.Item',
        'x-component-props': {
          title: '对象数组',
        },
        'properties': {
          index: {
            'type': 'void',
            'x-component': 'ArrayCollapse.Index',
          },
          input: {
            'type': 'string',
            'x-decorator': 'FormItem',
            'title': 'Input',
            'required': true,
            'x-component': 'Input',
          },
          remove: {
            'type': 'void',
            'x-component': 'ArrayCollapse.Remove',
          },
          moveUp: {
            'type': 'void',
            'x-component': 'ArrayCollapse.MoveUp',
          },
          moveDown: {
            'type': 'void',
            'x-component': 'ArrayCollapse.MoveDown',
          },
        },
      },
      'properties': {
        addition: {
          'type': 'void',
          'title': '添加条目',
          'x-component': 'ArrayCollapse.Addition',
        },
      },
    },
    array_unshift: {
      'type': 'array',
      'x-component': 'ArrayCollapse',
      'maxItems': 3,
      'x-decorator': 'FormItem',
      'items': {
        'type': 'object',
        'x-component': 'ArrayCollapse.Item',
        'x-component-props': {
          title: '对象数组',
        },
        'properties': {
          index: {
            'type': 'void',
            'x-component': 'ArrayCollapse.Index',
          },
          input: {
            'type': 'string',
            'x-decorator': 'FormItem',
            'title': 'Input',
            'required': true,
            'x-component': 'Input',
          },
          remove: {
            'type': 'void',
            'x-component': 'ArrayCollapse.Remove',
          },
          moveUp: {
            'type': 'void',
            'x-component': 'ArrayCollapse.MoveUp',
          },
          moveDown: {
            'type': 'void',
            'x-component': 'ArrayCollapse.MoveDown',
          },
        },
      },
      'properties': {
        addition: {
          'type': 'void',
          'title': '添加条目(unshift)',
          'x-component': 'ArrayCollapse.Addition',
          'x-component-props': {
            method: 'unshift',
          },
        },
      },
    },
  },
}

async function log(values) {
  console.log(values)
}
</script>

<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>

<style lang="scss" scoped></style>
