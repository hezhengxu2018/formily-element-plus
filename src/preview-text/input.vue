<script setup lang="ts">
import { ElSpace } from 'element-plus'
import { toRef } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { usePlaceholder } from './index'

defineOptions({
  name: 'FPreviewTextInput',
})

const props = defineProps<{
  value?: any
}>()

const slots = defineSlots<{
  prepend?: () => any
  prefix?: () => any
  suffix?: () => any
  append?: () => any
}>()

const prefixCls = `${stylePrefix}-preview-text`

const value = toRef(props, 'value')
const placeholder = usePlaceholder(value)
</script>

<template>
  <ElSpace :class="prefixCls">
    <slot v-if="slots.prepend" name="prepend" />
    <slot v-if="slots.prefix" name="prefix" />
    <ElText>
      {{ placeholder }}
    </ElText>
    <slot v-if="slots.suffix" name="suffix" />
    <slot v-if="slots.append" name="append" />
  </ElSpace>
</template>
