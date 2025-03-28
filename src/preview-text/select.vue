<script setup lang="ts">
import type { Field } from '@formily/core'
import { useField } from '@formily/vue'
import { ElSpace, ElTag } from 'element-plus'
import { isNil } from 'lodash-es'
import { useAttrs } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { usePlaceholder } from './index'

defineOptions({
  name: 'FPreviewTextSelect',
})

const props = defineProps<{
  value?: any
}>()

const prefixCls = `${stylePrefix}-preview-text`

const fieldRef = useField<Field>()
const attrs = useAttrs()
const dataSource = fieldRef.value.dataSource ?? []
const placeholder = usePlaceholder()
</script>

<template>
  <div :class="prefixCls">
    <template v-if="isNil(props.value)">
      <ElText>
        {{ placeholder }}
      </ElText>
    </template>
    <template v-else-if="!attrs.multiple">
      <ElText>
        {{ dataSource.find(i => i.value === props.value)?.label ?? props.value }}
      </ElText>
    </template>
    <ElSpace v-else>
      <ElTag v-for="(item, key) of props.value" :key="key">
        {{ dataSource.find(i => i.value === item)?.label ?? item }}
      </ElTag>
    </ElSpace>
  </div>
</template>
