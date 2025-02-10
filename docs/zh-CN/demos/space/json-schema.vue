<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import {
  FormButtonGroup,
  FormItem,
  FormLayout,
  Input,
  Submit,
} from '@sliver/formily-element-plus'
import { ElSpace } from 'element-plus'

const { SchemaField } = createSchemaField({
  components: {
    FormLayout,
    FormItem,
    Input,
    ElSpace,
  },
})

const schema = {
  type: 'object',
  properties: {
    name: {
      'type': 'void',
      'title': '姓名',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        asterisk: true,
        feedbackLayout: 'none',
      },
      'x-component': 'ElSpace',
      'properties': {
        firstName: {
          'type': 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'required': true,
        },
        lastName: {
          'type': 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'required': true,
        },
      },
    },
    texts: {
      'type': 'void',
      'title': '文本串联',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        asterisk: true,
        feedbackLayout: 'none',
      },
      'x-component': 'ElSpace',
      'properties': {
        aa: {
          'type': 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            addonAfter: '单位',
          },
          'x-component': 'Input',
          'required': true,
        },
        bb: {
          'type': 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            addonAfter: '单位',
          },
          'x-component': 'Input',
          'required': true,
        },
        cc: {
          'type': 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            addonAfter: '单位',
          },
          'x-component': 'Input',
          'required': true,
        },
      },
    },

    textarea: {
      'type': 'string',
      'title': '文本框',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        style: {
          width: 400,
        },
      },
      'required': true,
    },
  },
}

const form = createForm()

function log(value) {
  console.log(value)
}
</script>

<template>
  <FormProvider :form="form">
    <FormLayout :label-col="6" :wrapper-col="16">
      <SchemaField :schema="schema" />
      <FormButtonGroup align-form-item>
        <Submit @submit="log">
          提交
        </Submit>
      </FormButtonGroup>
    </FormLayout>
  </FormProvider>
</template>
