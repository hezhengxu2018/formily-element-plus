<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import {
  ArrayItems,
  DatePicker,
  FormButtonGroup,
  FormItem,
  Input,
  Select,
  Space,
  Submit,
} from '@sliver/formily-element-plus'

const {
  SchemaField,
  SchemaArrayField,
  SchemaObjectField,
  SchemaVoidField,
  SchemaStringField,
} = createSchemaField({
  components: {
    FormItem,
    Space,
    Input,
    Select,
    DatePicker,
    ArrayItems,
  },
})
const form = createForm()

async function log(values) {
  console.log(values)
}
</script>

<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaArrayField
        name="string_array"
        title="字符串数组"
        x-decorator="FormItem"
        x-component="ArrayItems"
      >
        <SchemaVoidField x-component="Space">
          <SchemaVoidField
            x-decorator="FormItem"
            x-component="ArrayItems.SortHandle"
          />
          <SchemaStringField
            x-decorator="FormItem"
            required
            name="input"
            x-component="Input"
            :x-component-props="{
              style: {
                width: '160px',
              },
            }"
          />
          <SchemaVoidField
            x-decorator="FormItem"
            x-component="ArrayItems.Remove"
          />
        </SchemaVoidField>
        <SchemaVoidField x-component="ArrayItems.Addition" title="添加条目" />
      </SchemaArrayField>
      <SchemaArrayField
        name="array"
        title="对象数组"
        x-decorator="FormItem"
        x-component="ArrayItems"
      >
        <SchemaObjectField>
          <SchemaVoidField x-component="Space">
            <SchemaVoidField
              x-decorator="FormItem"
              x-component="ArrayItems.SortHandle"
            />
            <SchemaStringField
              x-decorator="FormItem"
              required
              title="日期"
              name="date"
              x-component="DatePicker"
              :x-component-props="{
                type: 'daterange',
                style: {
                  width: '160px',
                },
              }"
            />
            <SchemaStringField
              x-decorator="FormItem"
              required
              title="输入框"
              name="input"
              x-component="Input"
            />
            <SchemaStringField
              x-decorator="FormItem"
              required
              title="选择框"
              name="select"
              :enum="[
                { label: '选项1', value: 1 },
                { label: '选项2', value: 2 },
              ]"
              x-component="Select"
              :x-component-props="{
                style: {
                  width: 160,
                },
              }"
            />
            <SchemaVoidField
              x-decorator="FormItem"
              x-component="ArrayItems.Remove"
            />
          </SchemaVoidField>
        </SchemaObjectField>
        <SchemaVoidField x-component="ArrayItems.Addition" title="添加条目" />
      </SchemaArrayField>
      <SchemaArrayField
        name="array2"
        title="对象数组"
        x-decorator="FormItem"
        x-component="ArrayItems"
        :x-component-props="{ style: { width: '600px' } }"
      >
        <SchemaObjectField x-decorator="ArrayItems.Item">
          <SchemaVoidField x-component="Space" :x-component-props="{ style: { paddingTop: '18px' } }">
            <SchemaVoidField
              x-decorator="FormItem"
              x-component="ArrayItems.SortHandle"
            />
            <SchemaStringField
              x-decorator="FormItem"
              required
              title="日期"
              name="date"
              x-component="DatePicker"
              :x-component-props="{
                type: 'daterange',
                style: {
                  width: '250px',
                },
              }"
            />
            <SchemaStringField
              x-decorator="FormItem"
              required
              title="输入框"
              name="input"
              x-component="Input"
            />
            <SchemaVoidField
              x-decorator="FormItem"
              x-component="ArrayItems.Remove"
            />
          </SchemaVoidField>
        </SchemaObjectField>
        <SchemaVoidField x-component="ArrayItems.Addition" title="添加条目" />
      </SchemaArrayField>
    </SchemaField>
    <FormButtonGroup>
      <Submit @submit="log">
        提交
      </Submit>
    </FormButtonGroup>
  </FormProvider>
</template>
