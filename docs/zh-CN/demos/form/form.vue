<script>
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import {
  Form,
  FormButtonGroup,
  FormItem,
  Input,
  Select,
  Submit,
} from '@sliver/formily-element-plus'

const form = createForm()
const fields = createSchemaField({ components: { Input, Select, FormItem } })

export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { FormButtonGroup, Submit, Form, ...fields },
  data() {
    return {
      form,
    }
  },

  methods: {
    log(value) {
      console.log(value)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('mock request success')
          resolve(value)
        }, 5000)
      })
    },
  },
}
</script>

<template>
  <Form
    :form="form"
    :label-col="6"
    :wrapper-col="10"
    @auto-submit="log"
    @auto-submit-failed="log('failed')"
  >
    <SchemaField>
      <SchemaStringField
        name="input"
        title="输入框"
        x-decorator="FormItem"
        x-component="Input"
        :x-validator="[{ min: 5 }, { format: 'url' }]"
        :required="true"
      />
      <SchemaStringField
        name="select"
        title="选择框"
        x-decorator="FormItem"
        x-component="Select"
        :enum="[
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
          },
        ]"
        :required="true"
      />
    </SchemaField>
    <FormButtonGroup align-form-item>
      <Submit>提交</Submit>
    </FormButtonGroup>
  </Form>
</template>
