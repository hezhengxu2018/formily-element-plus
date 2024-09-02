<script setup lang="ts">
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import { ElButton } from 'element-plus'
import {
  Form,
  FormButtonGroup,
  FormCollapse,
  FormItem,
  Input,
  Submit,
} from '../../../index'

const { SchemaField, SchemaVoidField, SchemaStringField } = createSchemaField({
  components: {
    FormItem,
    FormCollapse,
    Input,
  },
})

const form = createForm()
const formCollapse = FormCollapse.createFormCollapse()

function log(values) {
  console.log(values)
}
</script>

<template>
  <Form :form="form" :label-col="6" :wrapper-col="10">
    <SchemaField>
      <SchemaVoidField
        type="void"
        title="折叠面板"
        x-decorator="FormItem"
        x-component="FormCollapse"
        :x-component-props="{ formCollapse }"
      >
        <SchemaVoidField
          type="void"
          name="tab1"
          x-component="FormCollapse.Item"
          :x-component-props="{ title: 'A12' }"
          :x-content="{
            title: '测试用的插槽',
          }"
        >
          <SchemaStringField
            name="aaa"
            x-decorator="FormItem"
            title="AAA"
            required
            x-component="Input"
          />
        </SchemaVoidField>
        <SchemaVoidField
          name="tab2"
          x-component="FormCollapse.Item"
          :x-component-props="{ title: 'A2' }"
        >
          <SchemaStringField
            name="bbb"
            x-decorator="FormItem"
            title="BBB"
            required
            x-component="Input"
          />
        </SchemaVoidField>
        <SchemaVoidField
          name="tab3"
          x-component="FormCollapse.Item"
          :x-component-props="{ title: 'A3' }"
        >
          <SchemaStringField
            name="ccc"
            x-decorator="FormItem"
            title="CCC"
            required
            x-component="Input"
          />
        </SchemaVoidField>
      </SchemaVoidField>
    </SchemaField>
    <FormButtonGroup align-form-item>
      <ElButton
        @click="
          () => {
            form.query('tab3').take((field) => {
              field.visible = !field.visible
            })
          }
        "
      >
        显示/隐藏最后一个Tab
      </ElButton>
      <ElButton
        @click="
          () => {
            formCollapse.toggleActiveKey('tab2')
          }
        "
      >
        切换第二个Tab
      </ElButton>
      <Submit @submit="log">
        提交
      </Submit>
    </FormButtonGroup>
  </Form>
</template>

<style lang="scss" scoped></style>
