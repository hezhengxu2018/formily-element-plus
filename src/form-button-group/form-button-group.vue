<script lang="ts" setup>
import { ElFormItem, ElSpace } from 'element-plus'
import { stylePrefix } from '../__builtins__'

defineOptions({
  name: 'FFormButtonGroup',
})

const props = defineProps({
  align: {
    type: String,
    default: 'left',
  },
  gutter: {
    type: Number,
    default: 8,
  },
  alignFormItem: {
    type: Boolean,
    default: false,
  },
})

const prefixCls = `${stylePrefix}-form-button-group`
</script>

<template>
  <ElFormItem
    v-if="props.alignFormItem"
    colon="false"
    label=" "
    v-bind="$attrs"
    :style="{
      margin: 0,
      padding: 0,
      width: '100%',
    }"
  >
    <ElSpace :size="props.gutter">
      <slot />
    </ElSpace>
  </ElFormItem>
  <ElSpace
    v-else
    v-bind="$attrs"
    :class="prefixCls"
    :style="{
      justifyContent: props.align === 'left'
        ? 'flex-start'
        : (props.align === 'right'
          ? 'flex-end'
          : 'center'),
      display: 'flex',
    }"
    :size="props.gutter"
  >
    <slot />
  </ElSpace>
</template>
