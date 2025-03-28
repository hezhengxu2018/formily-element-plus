<script setup lang="ts">
import type { TimePickerProps } from '../time-picker'
import { isArr } from '@formily/shared'
import { dayjs, ElText } from 'element-plus'
import { useAttrs } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { usePlaceholder } from './index'

defineOptions({
  name: 'FPreviewTextTimePicker',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
}>()
const attrs = useAttrs() as TimePickerProps
const prefixCls = `${stylePrefix}-preview-text`

const placeholder = usePlaceholder()
const format = attrs.format || 'HH:mm:ss'
</script>

<template>
  <div :class="prefixCls">
    <template v-if="isArr(props.value)">
      <ElText>
        {{ props.value[0] ? dayjs(props.value[0]).format(format) : placeholder }}
        {{ attrs.rangeSeparator ?? '~' }}
        {{ props.value[1] ? dayjs(props.value[1]).format(format) : placeholder }}
      </ElText>
    </template>
    <template v-else>
      <ElText>
        {{ props.value ? dayjs(props.value).format(format) : placeholder }}
      </ElText>
    </template>
  </div>
</template>
