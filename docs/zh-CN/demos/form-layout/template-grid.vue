<script setup lang="ts">
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, FormLayout, Input, Select } from '@sliver/formily-element-plus'

const form = createForm()
</script>

<template>
  <FormProvider :form="form">
    <FormLayout
      :breakpoints="[600, 700, 780]"
      layout="horizontal"
      label-align="left"
      :label-col="[4, 6, 8]"
      :wrapper-col="10"
    >
      <Field
        name="input"
        title="输入框输入框输入框输入框输入框输入框"
        :decorator="[
          FormItem,
          {
            tooltip: '123',
          },
        ]"
        :component="[Input]"
        :required="true"
      />
      <Field
        name="select"
        title="选择框选择框选择框选择框选择框选择框"
        :decorator="[FormItem]"
        :component="[Select]"
        :required="true"
      />
    </FormLayout>
  </FormProvider>
</template>
