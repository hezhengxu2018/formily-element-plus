<script setup lang="ts">
import type { Form } from '@formily/core'
import type { PropType } from 'vue'
import type { FormDialogSlots, IFormDialogProps } from './types'
import { FormProvider } from '@formily/vue'
import { ElButton, ElConfigProvider, ElDialog } from 'element-plus'
import { omit } from 'lodash-es'
import { computed } from 'vue'
import { loadElConfigProvider, stylePrefix } from '../__builtins__'

defineOptions({
  name: 'FormDialogContent',
})
const props = defineProps({
  dialogProps: {
    type: Object as PropType<IFormDialogProps>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object as PropType<Form>,
    required: true,
  },
  resolve: {
    type: Function as PropType<() => void>,
    required: true,
  },
  reject: {
    type: Function as PropType<() => void>,
    required: true,
  },
})
const slots = defineSlots<FormDialogSlots>()
const prefixCls = `${stylePrefix}-form-dialog`
const elConfig = loadElConfigProvider()
const innerProps = computed(() => {
  return omit(props.dialogProps, [
    'modelValue',
    'onUpdate:modelValue',
    'beforeClose',
  ])
})
</script>

<template>
  <ElDialog
    v-bind="innerProps"
    :model-value="visible"
    :class="prefixCls"
    :z-index="elConfig.zIndex"
  >
    <template v-if="slots.header" #header>
      <slot name="header" :resolve :reject :form />
    </template>

    <template #default>
      <FormProvider :form="props.form">
        <ElConfigProvider v-bind="elConfig">
          <slot />
        </ElConfigProvider>
      </FormProvider>
    </template>

    <template #footer>
      <div :class="`${prefixCls}-footer`">
        <template v-if="slots.footer">
          <slot name="footer" :resolve :reject :form />
        </template>
        <template v-else>
          <ElButton
            v-bind="props.dialogProps.cancelButtonProps"
            @click="props.reject()"
          >
            {{ props.dialogProps.cancelText || '取消' }}
          </ElButton>
          <ElButton
            type="primary"
            v-bind="props.dialogProps.okButtonProps"
            :loading="props.form.submitting"
            @click="props.resolve()"
          >
            {{ props.dialogProps.okText || '确定' }}
          </ElButton>
        </template>
      </div>
    </template>
  </ElDialog>
</template>
