<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { SelectTable, Submit } from '@sliver/formily-element-plus'
import { ElTableColumn } from 'element-plus'
import { h } from 'vue'

const form = createForm()
const { SchemaField, SchemaStringField } = createSchemaField({
  components: {
    SelectTable,
  },
})

async function log(value) {
  console.log(value)
}
</script>

<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaStringField
        name="selectTable" x-component="SelectTable" :x-component-props="{
          multiple: true,
          rowKey: 'key',
        }" :enum="[
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ]" :x-content="{
          default: () => [
            h(ElTableColumn, {
              prop: 'name',
              label: 'Title',
            }),
            h(ElTableColumn, {
              prop: 'description',
              label: 'Description',
            }, {
              default: ({ row }) => `${row.description} - 通过插槽渲染`,
            })],
        }"
      />
    </SchemaField>
    <Submit style="margin-top: 30px;" @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
