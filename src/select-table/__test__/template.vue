<script setup lang="ts">
import { createForm } from '@formily/core'
import { Field } from '@formily/vue'
import { Form, FormItem, Submit } from '../../index'
import SelectTable from '../index'

const form = createForm()

function onSubmit(value) {
  console.log(value)
}
</script>

<template>
  <Form :form="form">
    <Field
      name="SelectTable"
      :data-source="[
        { key: '1', name: 'title-1', description: 'description-1' },
        { key: '2', name: 'title-2', description: 'description-2' },
        { key: '3', name: 'title-3', description: 'description-3' },
      ]"
      :decorator="[FormItem]"
      :component="[
        SelectTable,
        {
          columns: [
            { prop: 'name', label: 'Title' },
            { prop: 'description', label: 'Description' },
          ],
        },
      ]"
    />
    <Submit @submit="onSubmit">
      提交
    </Submit>
  </Form>
</template>
