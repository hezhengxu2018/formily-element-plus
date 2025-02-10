<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormConsumer, FormProvider } from '@formily/vue'
import { FormItem, InputNumber } from '@sliver/formily-element-plus'
import { ElSpace } from 'element-plus'

const form = createForm()
</script>

<template>
  <FormProvider :form="form">
    <ElSpace>
      <Field
        name="price"
        title="价格"
        :initial-value="5.2"
        :decorator="[FormItem]"
        :component="[
          InputNumber,
          {
            placeholder: '请输入',
            style: {
              width: 100,
            },
          },
        ]"
      />
      <FormItem>×</FormItem>
      <Field
        name="count"
        title="数量"
        :initial-value="100"
        :decorator="[FormItem]"
        :component="[
          InputNumber,
          {
            placeholder: '请输入',
            style: {
              width: 100,
            },
          },
        ]"
      />
      <FormConsumer>
        <template #default="{ form: consumerForm }">
          <FormItem>
            = {{ `${consumerForm.values.price * consumerForm.values.count} 元` }}
          </FormItem>
        </template>
      </FormConsumer>
    </ElSpace>
  </FormProvider>
</template>
