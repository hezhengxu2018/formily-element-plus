<script lang="ts" setup>
import type { Field } from '@formily/core'
import type { IFormItemProps } from '../form-item/types'
import { Close, Edit } from '@element-plus/icons-vue'
import { isPlainObj, isValid } from '@formily/shared'
import { useField } from '@formily/vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { computed, nextTick, ref } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { FormBaseItem } from '../form-item'
import { omit } from 'lodash-es'

defineOptions({
  name: 'FEditable',
})

const props = withDefaults(defineProps<IFormItemProps & { editProps?: IFormItemProps }>(), {
  feedbackLayout: 'popover',
  size: 'default',
})

const fieldRef = useField<Field>()
const innerRef = ref<HTMLElement>(null)
const prefixCls = `${stylePrefix}-editable`
const formItemRef = ref<InstanceType<typeof FormBaseItem>>(null)

const commonProps = computed(() => omit(props, 'editProps'))
const editProps = computed(() => {
  if (isPlainObj(props.editProps)) {
    return { ...props, ...props.editProps }
  }
  return props
})

function handleEnsureReadPretty() {
  /* istanbul ignore if -- @preserve */
  if (!isValid(fieldRef.value.data)) {
    fieldRef.value.data = {}
  }
  /* istanbul ignore if -- @preserve */
  if (!fieldRef.value.data.readPretty) {
    return
  }
}

handleEnsureReadPretty()
fieldRef.value.data.readPretty = true

async function onClick() {
  handleEnsureReadPretty()
  fieldRef.value.data.readPretty = false
  await nextTick()
  formItemRef.value.feedbackTooltipRef.updatePopper()
  innerRef.value?.querySelector('input')?.focus()
}

async function onClickOutside() {
  handleEnsureReadPretty()
  fieldRef.value.data.readPretty = true
  await nextTick()
  formItemRef.value.feedbackTooltipRef.updatePopper()
}
</script>

<template>
  <div ref="innerRef" :class="prefixCls">
    <div v-click-outside="onClickOutside" :class="`${prefixCls}-content`">
      <FormBaseItem ref="formItemRef" v-bind="fieldRef.data?.readPretty === false ? editProps : commonProps" @click="onClick">
        <div>
          <slot />
        </div>
      </FormBaseItem>
      <template v-if="!fieldRef.disabled">
        <template v-if="fieldRef.data?.readPretty === true">
          <FormBaseItem :size="props.size" :feedback-layout="props.feedbackLayout">
            <Edit :class="`${prefixCls}-edit-btn`" @click="onClick" />
          </FormBaseItem>
        </template>
        <template v-else>
          <FormBaseItem :size="props.size" :feedback-layout="props.feedbackLayout">
            <Close :class="`${prefixCls}-close-btn`" @click="onClickOutside" />
          </FormBaseItem>
        </template>
      </template>
    </div>
  </div>
</template>
