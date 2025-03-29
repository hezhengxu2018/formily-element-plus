<script setup lang="ts">
import type { DatePickerProps } from 'element-plus'
import { dayjs, ElSpace, ElTag, ElText } from 'element-plus'
import { useAttrs } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { usePreviewConfig } from './utils'

defineOptions({
  name: 'FPreviewTextDatePicker',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
}>()
const attrs = useAttrs() as DatePickerProps
const prefixCls = `${stylePrefix}-preview-text`
const { spaceProps, textProps, tagProps, placeholder } = usePreviewConfig()

const type = attrs.type || 'date'
const format = attrs.format || 'YYYY-MM-DD'
</script>

<template>
  <div :class="prefixCls">
    <template v-if="props.value">
      <template v-if="type.endsWith('range')">
        <ElText v-bind="textProps">
          {{ props.value[0] ? dayjs($props.value[0]).format(format) : placeholder }}
          {{ attrs.rangeSeparator ?? '~' }}
          {{ props.value[1] ? dayjs($props.value[1]).format(format) : placeholder }}
        </ElText>
      </template>
      <template v-else-if="type.endsWith('s')">
        <ElSpace v-bind="spaceProps">
          <ElTag v-for="i of $props.value" :key="i" v-bind="tagProps">
            {{ dayjs(i).format(format) }}
          </ElTag>
        </ElSpace>
      </template>
      <template v-else>
        <ElText v-bind="textProps">
          {{ dayjs($props.value).format(format) }}
        </ElText>
      </template>
    </template>
    <template v-else>
      <ElText v-bind="textProps">
        {{ placeholder }}
      </ElText>
    </template>
  </div>
</template>
