<script lang="ts" setup>
import type { Form as FormType, IFormFeedback } from '@formily/core'
import type { Component, PropType } from 'vue'
import { FormProvider, useForm } from '@formily/vue'
import { FormLayout } from '../form-layout'
import { PreviewText } from '../preview-text'

defineOptions({
  name: 'FForm',
  inheritAttrs: false,
})

const props = defineProps({
  form: {
    type: Object as PropType<FormType>,
  },
  component: {
    type: [String, Object] as PropType<string | Component>,
    default: 'form',
  },
  previewTextPlaceholder: {
    type: String,
  },
  onAutoSubmit: {
    type: Function as PropType<(values: FormType['values']) => Promise<any>>,
  },
  onAutoSubmitFailed: {
    type: Function as PropType<(error: IFormFeedback[]) => void>,
  },
})

const top = useForm()

function handleSubmit(e: Event, form: FormType) {
  e?.stopPropagation?.()
  e?.preventDefault?.()
  form
    .submit(values => props.onAutoSubmit?.(values))
    .catch(error => props.onAutoSubmitFailed?.(error))
}
</script>

<template>
  <FormProvider v-if="props.form" :form="props.form">
    <PreviewText :placeholder="props.previewTextPlaceholder">
      <FormLayout v-bind="$attrs">
        <component
          :is="props.component"
          @submit="(e) => handleSubmit(e, form)"
        >
          <slot />
        </component>
      </FormLayout>
    </PreviewText>
  </FormProvider>
  <template v-else-if="top">
    <PreviewText :placeholder="props.previewTextPlaceholder">
      <FormLayout v-bind="$attrs">
        <component
          :is="props.component"
          @submit="(e) => handleSubmit(e, top)"
        >
          <slot />
        </component>
      </FormLayout>
    </PreviewText>
  </template>
</template>
