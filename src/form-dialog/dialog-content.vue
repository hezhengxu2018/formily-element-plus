<script setup lang="ts">
import type { ElDialog as ElDialogProps } from 'element-plus'
import type { PropType } from 'vue'
import { FormProvider } from '@formily/vue'
import { ElButton, ElConfigProvider, ElDialog } from 'element-plus'
import { h, ref } from 'vue'

defineOptions({
  name: 'FormDialogContent',
})

const props = defineProps({
  dialogProps: {
    type: Object as PropType<typeof ElDialogProps>,
    required: true,
  },
  prefixCls: {
    type: String,
    required: true,
  },
  elConfig: {
    type: Object,
    required: true,
  },
  component: {
    type: Object,
    required: true,
  },
  form: {
    type: Object,
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

const visible = ref(false)
defineExpose({
  visible,
})

function handleBeforeClose(done: () => void) {
  props.reject()
  done()
}

function handleCancel(e: Event) {
  props.dialogProps.onCancel?.(e)
  props.reject()
}

function handleOK(e: Event) {
  props.dialogProps.onOK?.(e)
  props.resolve()
}

function FooterButtons() {
  return [
    h(
      ElButton,
      {
        ...props.dialogProps.cancelButtonProps,
        onClick: handleCancel,
      },
      () => props.dialogProps.cancelText || '取消',
    ),
    h(
      ElButton,
      {
        type: 'primary',
        ...props.dialogProps.okButtonProps,
        loading: props.form.submitting,
        onClick: handleOK,
      },
      () => props.dialogProps.okText || '确定',
    ),
  ]
}
</script>

<template>
  <ElDialog
    v-bind="{ ...dialogProps }"
    v-model="visible"
    :class="[prefixCls]"
    :z-index="elConfig.zIndex"
    :before-close="handleBeforeClose"
    @close="dialogProps.onClose?.()"
    @closed="dialogProps.onClosed?.()"
    @open="dialogProps.onOpen?.()"
    @opened="dialogProps.onOpend?.()"
  >
    <template #default>
      <FormProvider :form="props.form">
        <ElConfigProvider v-bind="elConfig">
          <template v-if="component?.default">
            <component :is="component.default" />
          </template>
          <component :is="component" v-else />
        </ElConfigProvider>
      </FormProvider>
    </template>

    <template v-if="component?.header" #header>
      <component :is="component.header({ resolve, reject, form })" />
    </template>

    <template #footer>
      <div :class="`${prefixCls}-footer`">
        <template v-if="props.component?.footer">
          <component :is="props.component.footer({ resolve, reject, form, doms: FooterButtons })" />
        </template>
        <template v-else>
          <component :is="FooterButtons" />
        </template>
      </div>
    </template>
  </ElDialog>
</template>
