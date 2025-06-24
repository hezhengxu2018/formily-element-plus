<script setup lang="ts">
import type { InputProps } from 'element-plus'
import type { ComputedRef } from 'vue'
import { isFn, isValid } from '@formily/shared'
import { ElSpace, ElText, useAttrs } from 'element-plus'
import { stylePrefix } from '../__builtins__/configs'
import { usePreviewConfig } from './utils'

defineOptions({
  name: 'FPreviewTextInput',
  inheritAttrs: false,
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
const attrs = useAttrs() as ComputedRef<InputProps>
const prefixCls = `${stylePrefix}-preview-text`
const { spaceProps, textProps, placeholder } = usePreviewConfig()
</script>

<template>
  <ElSpace :class="prefixCls" v-bind="spaceProps">
    <slot v-if="slots.prepend" name="prepend" />
    <slot v-if="slots.prefix" name="prefix" />
    <ElText v-bind="textProps">
      <template v-if="isFn(attrs.formatter)">
        {{ attrs.formatter(props.value) }}
      </template>
      <template v-else-if="isValid(props.value)">
        {{ props.value === '' ? '&nbsp;' : props.value }}
      </template>
      <template v-else>
        {{ placeholder }}
      </template>
    </ElText>
    <slot v-if="slots.suffix" name="suffix" />
    <slot v-if="slots.append" name="append" />
  </ElSpace>
</template>
