<script lang="ts" setup>
import type { Field } from '@formily/core'
import { ChatDotRound, Edit } from '@element-plus/icons-vue'
import { observable } from '@formily/reactive'
import { useField } from '@formily/vue'
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
const visible = ref(false)

function handleInput(value: boolean) {
  visible.value = value
}
const parentPattern = observable.computed(() => getParentPattern(fieldRef))
</script>

<template>
  <div :class="prefixCls">
    <ElPopover
      v-bind="$attrs"
      :class="[prefixCls, $attrs.class]"
      :title="$attrs.title || fieldRef.title"
      :model-value="visible"
      trigger="click"
      width="auto"
      @update:model-value="handleInput"
    >
      <template #default>
        <slot />
      </template>
      <template #reference>
        <FormBaseItem :class="`${prefixCls}-trigger`">
          <div :class="`${prefixCls}-content`">
            <span :class="`${prefixCls}-preview`">
              {{ fieldRef.title }}
            </span>
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
