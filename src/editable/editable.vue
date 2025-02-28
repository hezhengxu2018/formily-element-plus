<script lang="ts" setup>
import type { Field } from '@formily/core'
import { ChatDotRound, Close, Edit } from '@element-plus/icons-vue'
import { observable, reaction } from '@formily/reactive'
import { useField } from '@formily/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { FormBaseItem } from '../form-item'
import { getFormItemProps, getParentPattern } from './utils'

defineOptions({
  name: 'FEditable',
  inheritAttrs: false,
})

const fieldRef = useField<Field>()
const innerRef = ref<HTMLElement | null>(null)
const prefixCls = `${stylePrefix}-editable`

onMounted(() => {
  innerRef.value = document.body
})

function setEditable(payload: boolean) {
  const pattern = getParentPattern(fieldRef)
  if (pattern !== 'editable')
    return
  fieldRef.value.setPattern(payload ? 'editable' : 'readPretty')
}

const dispose = reaction(
  () => getParentPattern(fieldRef),
  (pattern) => {
    if (pattern === 'editable')
      fieldRef.value.setPattern('readPretty')
  },
  { fireImmediately: true },
)

onBeforeUnmount(dispose)

function recover(editable: boolean) {
  if (editable && !fieldRef.value?.errors?.length)
    setEditable(false)
}

function onClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const close = innerRef.value?.querySelector(`.${prefixCls}-close-btn`)
  const field = fieldRef.value
  const editable = field.pattern === 'editable'

  if (target?.contains(close) || close?.contains(target)) {
    recover(editable)
  }
  else if (!editable) {
    setTimeout(() => {
      setEditable(true)
      setTimeout(() => {
        innerRef.value?.querySelector('input')?.focus()
      })
    })
  }
}

const parentPattern = observable.computed(() => getParentPattern(fieldRef))
const formItemProps = observable.computed(() => getFormItemProps(fieldRef))
</script>

<template>
  <div ref="innerRef" :class="prefixCls" @click="onClick">
    <div :class="`${prefixCls}-content`">
      <FormBaseItem v-bind="{ ...$attrs, ...formItemProps.value }">
        <slot />
      </FormBaseItem>
      <template v-if="!fieldRef.disabled">
        <template v-if="!(fieldRef.pattern === 'editable')">
          <FormBaseItem v-bind="{ ...$attrs, ...formItemProps.value }">
            <component
              :is="parentPattern.value === 'editable' ? Edit : ChatDotRound"
              :class="`${prefixCls}-edit-btn`"
            />
          </FormBaseItem>
        </template>
        <template v-else>
          <FormBaseItem v-bind="$attrs">
            <Close :class="`${prefixCls}-close-btn`" />
          </FormBaseItem>
        </template>
      </template>
    </div>
  </div>
</template>
