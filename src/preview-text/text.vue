<script setup lang="ts">
import { ElText } from 'element-plus'
import { stylePrefix } from '../__builtins__/configs'
import { usePlaceholder } from './index'

defineOptions({
  name: 'FPreviewText',
  inheritAttrs: false,
})
const props = defineProps<{
  value?: any
}>()

const prefixCls = `${stylePrefix}-preview-text`
const placeholder = usePlaceholder(props.value)
</script>

<template>
  <ElText :class="prefixCls">
    {{ placeholder }}
  </ElText>
</template>
