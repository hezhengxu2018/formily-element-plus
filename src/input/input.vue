<script setup lang="ts">
import type { InputProps } from 'element-plus'
import { useField } from '@formily/vue'
import { ElInput } from 'element-plus'
import { omit } from 'lodash-es'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'FInput',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: string | number
}>()

const emit = defineEmits<{
  (e: 'change', value: string | number): void
}>()

const slots = defineSlots<{
  prefix?: () => any
  suffix?: () => any
  prepend?: () => any
  append?: () => any
}>()

const attrs = useAttrs()

const innerAttrs = computed<Partial<InputProps>>(() => {
  return omit(attrs, ['modelValue', 'onChange'])
})
</script>

<template>
  <ElInput
    v-bind="innerAttrs"
    :model-value="props.value"
    @update:model-value="(val) => emit('change', val)"
  >
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <template v-if="slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="slots.append" #append>
      <slot name="append" />
    </template>
  </ElInput>
</template>