<script setup lang="ts">
import type { DatePickerProps } from 'element-plus'
import { dayjs, ElText } from 'element-plus'
import { useAttrs } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { usePlaceholder } from './index'

defineOptions({
  name: 'FPreviewTextDatePicker',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
}>()
const attrs = useAttrs() as DatePickerProps
const prefixCls = `${stylePrefix}-preview-text`

const placeholder = usePlaceholder()
const type = attrs.type || 'date'
const format = attrs.format || 'YYYY-MM-DD'
</script>

<template>
  <div :class="[prefixCls]">
    <template v-if="props.value">
      <template v-if="type.endsWith('range')">
        <ElText>
          {{ props.value[0] ? dayjs($props.value[0]).format(format) : placeholder }}
          {{ attrs.rangeSeparator ?? '~' }}
          {{ props.value[1] ? dayjs($props.value[1]).format(format) : placeholder }}
        </ElText>
      </template>
      <template v-else-if="type.endsWith('s')">
        <ElSpace>
          <ElTag v-for="i of $props.value" :key="i">
            {{ dayjs(i).format(format) }}
          </ElTag>
        </ElSpace>
      </template>
      <template v-else>
        <ElText>
          {{ dayjs($props.value).format(format) }}
        </ElText>
      </template>
    </template>
    <template v-else>
      <ElText>{{ placeholder }}</ElText>
    </template>
  </div>
</template>
