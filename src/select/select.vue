<script setup lang="ts">
import type { Options } from 'element-plus'
import { ElOption, ElOptionGroup, ElSelect } from 'element-plus'
import { omit } from 'lodash-es'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'FSelect',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
  options?: Array<string | number | Options>
}>()

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const slots = defineSlots<{
  option?: (props: { option: Options }) => any
  header?: () => any
  footer?: () => any
  prefix?: () => any
  empty?: () => any
  tag?: () => any
  loading?: () => any
  label?: () => any
}>()

const attrs = useAttrs()

const innerAttrs = computed(() => {
  return omit(attrs, ['modelValue', 'onChange'])
})
</script>

<template>
  <ElSelect v-bind="innerAttrs" :model-value="props.value" @update:model-value="(val) => emit('change', val)">
    <template v-for="option of props.options" :key="option.options ? option.label : option.value">
      <ElOptionGroup v-if="option.options" v-bind="option">
        <ElOption v-for="i of option.options" :key="i.value" v-bind="i">
          <slot v-if="slots.option" name="option" :option="i" />
        </ElOption>
      </ElOptionGroup>
      <ElOption v-else v-bind="option">
        <slot v-if="slots.option" name="option" :option="option" />
      </ElOption>
    </template>
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="slots.empty" #empty>
      <slot name="empty" />
    </template>
    <template v-if="slots.tag" #tag>
      <slot name="tag" />
    </template>
    <template v-if="slots.loading" #loading>
      <slot name="loading" />
    </template>
    <template v-if="slots.label" #label>
      <slot name="label" />
    </template>
  </ElSelect>
</template>
