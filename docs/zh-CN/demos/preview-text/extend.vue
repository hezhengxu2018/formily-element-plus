<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import {
  Cascader,
  DatePicker,
  Form,
  FormButtonGroup,
  FormItem,
  Input,
  Select,
  TimePicker,
} from '@sliver/formily-element-plus'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const { SchemaField, SchemaStringField } = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    DatePicker,
    Cascader,
    TimePicker,
  },
})

const form = createForm({ readPretty: true })

const vnode = () => h('div', {}, '123')
</script>

<template>
  <Form
    :label-col="6"
    :wrapper-col="10"
    :form="form"
    :preview-text-placeholder="vnode"
  >
    <SchemaField>
      <SchemaStringField
        x-decorator="FormItem"
        title="文本预览"
        x-component="Input"
        default="Hello world"
      />
      <SchemaStringField
        x-decorator="FormItem"
        title="选择项预览"
        x-component="Select"
        :x-component-props="{
          multiple: true,
        }"
        :default="['123', '222']"
        :enum="[
          { label: 'A111', value: '123' },
          {
            label: 'A222',
            value: '222',
          },
        ]"
      />
      <SchemaStringField
        x-decorator="FormItem"
        title="日期预览"
        x-component="DatePicker"
        default="2020-11-23 22:15:20"
      />
      <SchemaStringField
        x-decorator="FormItem"
        title="日期范围预览"
        x-component="DatePicker"
        :x-component-props="{ type: 'dates' }"
        :default="['2020-11-23 22:15:20', '2020-11-24 22:15:20']"
      />
      <SchemaStringField
        x-decorator="FormItem"
        title="Cascader预览"
        x-component="Cascader"
        :default="['hangzhou', 'yuhang']"
        :enum="[
          {
            label: '杭州',
            value: 'hangzhou',
            children: [{ label: '余杭', value: 'yuhang' }],
          },
        ]"
      />
    </SchemaField>
    <FormButtonGroup align-form-item>
      <ElButton
        @click="
          () => {
            form.setState((state) => {
              state.editable = !state.editable
            })
          }
        "
      >
        切换阅读态
      </ElButton>
    </FormButtonGroup>
  </Form>
</template>
