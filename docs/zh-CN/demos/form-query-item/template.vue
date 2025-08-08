<script setup lang="ts">
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormLayout, FormQueryItem, Input } from '@sliver/formily-element-plus'

const form = createForm()
</script>

<template>
  <FormProvider :form="form">
    <FormLayout
      :breakpoints="[680]"
      layout="horizontal"
      label-align="left"
    >
      <Field
        name="query"
        title="查询框"
        :decorator="[FormQueryItem]"
        :component="[Input]"
        :required="true"
      />
    </FormLayout>
  </FormProvider>
</template>
