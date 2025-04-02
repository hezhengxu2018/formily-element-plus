<script setup lang="ts">
import type { CascaderOption } from 'element-plus'
import { ElCascader } from 'element-plus'
import { omit } from 'lodash-es'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'FCascader',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
  options?: CascaderOption[]
}>()

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const attrs = useAttrs()

const innerAttrs = computed<any>(() => {
  return omit(attrs, ['modelValue', 'onChange'])
})
</script>

<template>
  <ElCascader
    v-bind="innerAttrs"
    :options="props.options"
    :model-value="props.value"
    @update:model-value="value => emit('change', value)"
  >
    <template v-if="$slots.default" #default="{ node, data }">
      <slot :node="node" :data="data" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </ElCascader>
</template>
