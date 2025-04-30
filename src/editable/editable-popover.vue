<script lang="ts" setup>
import type { Field } from '@formily/core'
import { ChatDotRound, Edit } from '@element-plus/icons-vue'
import { observable } from '@formily/reactive'
import { useField } from '@formily/vue'
import { ElPopover, ElText, ClickOutside as vClickOutside } from 'element-plus'
import { ref } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { FormBaseItem } from '../form-item'
import { getParentPattern } from './utils'

defineOptions({
  name: 'FEditablePopover',
  inheritAttrs: false,
})

const fieldRef = useField<Field>()
const prefixCls = `${stylePrefix}-editable`
const contentRef = ref<HTMLElement>()
const visible = ref(false)

const parentPattern = observable.computed(() => getParentPattern(fieldRef))
function onClickOutside(e) {
  const popoverDOM = contentRef.value.parentElement
  if (!popoverDOM.contains(e.target)) {
    visible.value = false
  }
}
function onClick(val) {
  if (val) {
    visible.value = true
  }
}
</script>

<template>
  <div :class="prefixCls">
    <ElPopover
      v-bind="$attrs"
      :visible="visible"
      :class="[prefixCls, $attrs.class]"
      :title="$attrs.title || fieldRef.title"
      trigger="click"
      width="auto"
      @update:visible="onClick"
    >
      <template #default>
        <div ref="contentRef" :class="`${prefixCls}-popover-wrapper`">
          <slot />
        </div>
      </template>
      <template #reference>
        <FormBaseItem v-click-outside="onClickOutside" :class="`${prefixCls}-trigger`">
          <div :class="`${prefixCls}-content`">
            <ElText>
              {{ fieldRef.title }}
            </ElText>
            <component
              :is="parentPattern.value === 'editable' ? Edit : ChatDotRound"
              :class="`${prefixCls}-edit-btn`"
            />
          </div>
        </FormBaseItem>
      </template>
    </ElPopover>
  </div>
</template>
