<script>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import {
  FormButtonGroup,
  FormItem,
  FormLayout,
  Input,
  Reset,
  Select,
  Submit,
} from '@sliver/formily-element-plus'

const fields = createSchemaField({ components: { FormItem, Input, Select } })

export default {
  components: {
    FormProvider,
    FormLayout,
    Submit,
    Reset,
    FormButtonGroup,
    FormButtonGroupSticky: FormButtonGroup.Sticky,
    ...fields,
  },
  data() {
    const form = createForm()
    return {
      form,
    }
  },
  methods: {
    log(v) {
      console.log(v)
    },
  },
}
</script>

<template>
  <FormProvider :form="form">
    <FormLayout :label-col="6" :wrapper-col="10">
      <SchemaField>
        <SchemaStringField required title="输入框1" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框2" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框3" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框4" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框5" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框6" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框7" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框8" x-decorator="FormItem" x-component="Input" />
        <SchemaStringField required title="输入框9" x-decorator="FormItem" x-component="Input" />
      </SchemaField>
      <FormButtonGroupSticky>
        <FormButtonGroup align-form-item>
          <Submit @submit="log">
            提交
          </Submit>
          <Reset>重置</Reset>
        </FormButtonGroup>
      </FormButtonGroupSticky>
    </FormLayout>
  </FormProvider>
</template>
