<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import {
  ArrayTable,
  Editable,
  FormItem,
  Input,
  Space,
  Submit,
} from '@sliver/formily-element-plus'

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    ArrayTable,
    Input,
    Editable,
    Space,
  },
})

const form = createForm()
const schema = {
  type: 'object',
  properties: {
    array: {
      'type': 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      'x-component-props': {
        paginationProps: {
          pageSize: 2,
          pageSizes: [2, 4, 6, 8, 10],
          background: false,
          size: 'small',
        },
      },
      'items': {
        type: 'object',
        properties: {
          column1: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 80,
              title: 'Index',
              align: 'center',
            },
            'properties': {
              index: {
                'type': 'void',
                'x-component': 'ArrayTable.Index',
              },
            },
          },
          column2: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: 'A1' },
            'properties': {
              a1: {
                'type': 'string',
                'x-decorator': 'Editable',
                'x-component': 'Input',
              },
            },
          },
          column3: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: 'Operations',
              prop: 'operations',
              width: 200,
              fixed: 'right',
            },
            'properties': {
              item: {
                'type': 'void',
                'x-component': 'FormItem',
                'properties': {
                  space: {
                    'type': 'void',
                    'x-component': 'Space',
                    'x-component-props': {
                      style: 'height: 100%',
                    },
                    'properties': {
                      remove: {
                        'type': 'void',
                        'x-component': 'ArrayTable.Remove',
                      },
                      moveDown: {
                        'type': 'void',
                        'x-component': 'ArrayTable.MoveDown',
                      },
                      moveUp: {
                        'type': 'void',
                        'x-component': 'ArrayTable.MoveUp',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      'properties': {
        add: {
          'type': 'void',
          'x-component': 'ArrayTable.Addition',
          'title': '添加条目',
        },
      },
    },
  },
}

async function log(...v) {
  console.log(...v)
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
