<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { SelectTable, Submit } from '@sliver/formily-element-plus'

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
        name="selectTable"
        x-component="SelectTable"
        :x-component-props="{
          mode: 'multiple',
          rowKey: 'key',
          columns: [
            { prop: 'name', label: '标题' },
            { prop: 'description', label: '描述' },
          ],
        }"
        :enum="[
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ]"
      />
    </SchemaField>
    <Submit style="margin-top: 30px;" @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
