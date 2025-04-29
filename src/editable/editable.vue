<script lang="ts" setup>
import type { Field } from '@formily/core'
import { Close, Edit } from '@element-plus/icons-vue'
import { observable, reaction } from '@formily/reactive'
import { useField } from '@formily/vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { FormBaseItem } from '../form-item'
import { getFormItemProps, getParentPattern } from './utils'

defineOptions({
  name: 'FEditable',
  inheritAttrs: false,
})

const fieldRef = useField<Field>()
const innerRef = ref<HTMLElement>(null)
const prefixCls = `${stylePrefix}-editable`

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

async function onClick() {
  setEditable(true)
  await nextTick()
  innerRef.value?.querySelector('input')?.focus()
}

function onClickOutside() {
  setEditable(false)
}

const formItemProps = observable.computed(() => getFormItemProps(fieldRef))
</script>

<template>
  <div ref="innerRef" :class="prefixCls">
    <div v-click-outside="onClickOutside" :class="`${prefixCls}-content`">
      <FormBaseItem v-bind="{ ...$attrs, ...formItemProps.value }" @click="onClick">
        <slot />
      </FormBaseItem>
      <template v-if="!fieldRef.disabled">
        <template v-if="!(fieldRef.pattern === 'editable')">
          <FormBaseItem v-bind="{ ...$attrs, ...formItemProps.value }">
            <Edit :class="`${prefixCls}-edit-btn`" @click="onClick" />
          </FormBaseItem>
        </template>
        <template v-else>
          <FormBaseItem v-bind="$attrs">
            <Close :class="`${prefixCls}-close-btn`" @click="onClickOutside" />
          </FormBaseItem>
        </template>
      </template>
    </div>
  </div>
</template>
