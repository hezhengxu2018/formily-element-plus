<script lang="ts" setup>
import type { IArrayBaseOperationProps } from './types'
import { ArrowDown } from '@element-plus/icons-vue'
import { isArr } from '@formily/shared'
import { ElLink } from 'element-plus'
import { compatibleUnderlineProp, prefixCls, useArray, useIndex } from './utils'

defineOptions({
  name: 'ArrayBaseMoveDown',
})

const props = defineProps<IArrayBaseOperationProps>()

const indexRef = useIndex()
const base = useArray()
// const lastIndex = base?.field.value.value?.length - 1

function handleClick() {
  if (isArr(base?.keyMap)) {
    base.keyMap.splice(
      indexRef.value + 1,
      0,
      base.keyMap.splice(indexRef.value, 1)[0],
    )
  }
  base?.field.value.moveDown(indexRef.value as number)
  base?.attrs?.moveDown?.(indexRef.value as number)
}
</script>

<template>
  <ElLink
    v-if="base?.field.value.pattern === 'editable'"
    :class="`${prefixCls}-move-down`"
    size="small"
    :icon="ArrowDown"
    :underline="compatibleUnderlineProp()"
    role="button"
    aria-label="下移条目"
    @click.stop="handleClick"
  >
    <slot>
      {{ props.title }}
    </slot>
  </ElLink>
</template>
