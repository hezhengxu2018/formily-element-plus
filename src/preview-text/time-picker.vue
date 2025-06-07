<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { TimePickerProps } from '../time-picker'
import { isArr } from '@formily/shared'
import { dayjs, ElText, useAttrs } from 'element-plus'
import { stylePrefix } from '../__builtins__/configs'
import { usePreviewConfig } from './utils'

defineOptions({
  name: 'FPreviewTextTimePicker',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
}>()
const attrs = useAttrs() as ComputedRef<TimePickerProps>
const prefixCls = `${stylePrefix}-preview-text`
const { textProps, placeholder } = usePreviewConfig()
const format = attrs.value.format || 'HH:mm:ss'
const parseFormat = attrs.value.valueFormat || 'HH:mm:ss'

function formatTimeValue(value: any): string | void {
  if (!value)
    return
  if (value instanceof Date) {
    return dayjs(value).format(format)
  }
  if (typeof value === 'string') {
    return dayjs(value, parseFormat).format(format)
  }
}
</script>

<template>
  <div :class="prefixCls">
    <template v-if="isArr(props.value)">
      <ElText v-bind="textProps">
        {{ formatTimeValue(props.value[0]) || placeholder }}
        {{ attrs.rangeSeparator ?? '~' }}
        {{ formatTimeValue(props.value[1]) || placeholder }}
      </ElText>
    </template>
    <template v-else>
      <ElText v-bind="textProps">
        {{ formatTimeValue(props.value) || placeholder }}
      </ElText>
    </template>
  </div>
</template>
