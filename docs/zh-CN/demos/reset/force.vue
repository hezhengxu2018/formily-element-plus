<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { FormButtonGroup, FormItem, Input, Reset } from '@sliver/formily-element-plus'

const { SchemaField, SchemaStringField } = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})

const form = createForm()
</script>

<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaStringField
        required
        name="input1"
        title="输入框"
        x-decorator="FormItem"
        x-component="Input"
      />
      <SchemaStringField
        required
        title="输入框"
        name="input2"
        x-decorator="FormItem"
        x-component="Input"
        default="123"
      />
    </SchemaField>
    <FormButtonGroup align-form-item>
      <Reset force-clear>
        重置
      </Reset>
    </FormButtonGroup>
  </FormProvider>
</template>
