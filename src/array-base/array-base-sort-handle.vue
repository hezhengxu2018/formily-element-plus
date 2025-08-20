<script lang="ts" setup>
import { Rank } from '@element-plus/icons-vue'
import { ElLink } from 'element-plus'
import { compatibleUnderlineFalse } from '../__builtins__'
import { prefixCls, useArray } from './utils'

defineOptions({
  name: 'ArrayBaseSortHandle',
})

const array = useArray()
</script>

<template>
  <ElLink
    v-if="array.field.value?.pattern === 'editable'"
    :class="`${prefixCls}-sort-handle`"
    size="small"
    :icon="Rank"
    :underline="compatibleUnderlineFalse()"
    role="button"
    aria-label="拖拽排序"
    aria-dropeffect="move"
  />
</template>
