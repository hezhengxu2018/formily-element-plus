<script setup lang="ts">
import { ElInput } from 'element-plus'
import { useCleanAttrs } from '../__builtins__/index'

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

const { props: inputProps } = useCleanAttrs()
</script>

<template>
  <ElInput
    v-bind="inputProps"
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
