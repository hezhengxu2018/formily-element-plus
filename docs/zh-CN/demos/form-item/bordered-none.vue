<script setup lang="ts">
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import {
  Cascader,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Switch,
} from '@sliver/formily-element-plus'

const form = createForm()
const { SchemaField, SchemaStringField, SchemaBooleanField }
  = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Cascader,
      DatePicker,
      Switch,
      InputNumber,
    },
  })
</script>

<template>
  <Form :form="form">
    <SchemaField>
      <SchemaStringField
        name="input"
        title="Input"
        x-decorator="FormItem"
        x-component="Input"
        required
        :x-decorator-props="{
          bordered: false,
        }"
      />
      <SchemaStringField
        name="Select"
        title="Select"
        x-decorator="FormItem"
        x-component="Select"
        required
        :x-decorator-props="{
          bordered: false,
        }"
      />
      <SchemaStringField
        name="Cascader"
        title="Cascader"
        x-decorator="FormItem"
        x-component="Cascader"
        required
        :x-decorator-props="{
          bordered: false,
        }"
      />
      <SchemaStringField
        name="DatePicker"
        title="DatePicker"
        x-decorator="FormItem"
        x-component="DatePicker"
        required
        :x-decorator-props="{
          bordered: false,
        }"
      />
      <SchemaStringField
        name="InputNumber"
        title="InputNumber"
        x-decorator="FormItem"
        x-component="InputNumber"
        required
        :x-decorator-props="{
          bordered: false,
        }"
      />
      <SchemaBooleanField
        name="Switch"
        title="Switch"
        x-decorator="FormItem"
        x-component="Switch"
        required
        :x-decorator-props="{
          bordered: false,
        }"
      />
    </SchemaField>
  </Form>
</template>
