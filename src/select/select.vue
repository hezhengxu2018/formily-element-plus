<script setup lang="ts">
import type { ISelectProps } from 'element-plus'
import { useField } from '@formily/vue'
import { ElOption, ElOptionGroup, ElSelect } from 'element-plus'
import { omit } from 'lodash-es'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'FSelect',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
  options?: Array<OptionType | OptionGroupType>
}>()

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const slots = defineSlots<{
  option?: (props: { option: OptionType }) => any
  header?: () => any
  footer?: () => any
  prefix?: () => any
  empty?: () => any
  tag?: () => any
  loading?: () => any
  label?: () => any
}>()

type OptionType = InstanceType<typeof ElOption>['$props']
type OptionGroupType = InstanceType<typeof ElOptionGroup>['$props'] & {
  options: OptionType[]
}
const attrs = useAttrs()

const innerAttrs = computed<Partial<ISelectProps>>(() => {
  return omit(attrs, ['modelValue', 'onChange'])
})

const fieldRef = useField()

function isGroup(option: OptionType | OptionGroupType): option is OptionGroupType {
  return (option as OptionGroupType).options !== undefined
}
</script>

<template>
  <ElSelect v-bind="innerAttrs" :model-value="props.value" @update:model-value="(val) => emit('change', val)">
    <template v-for="option of props.options">
      <template v-if="isGroup(option)">
        <ElOptionGroup v-bind="omit(option, 'options')" :key="option.label">
          <ElOption v-for="i of option.options" :key="innerAttrs.valueKey ? i[innerAttrs.valueKey] : i.label" v-bind="i">
            <slot v-if="slots.option" name="option" :option="i" />
          </ElOption>
        </ElOptionGroup>
      </template>
      <ElOption v-else v-bind="option" :key="innerAttrs.valueKey ? option[innerAttrs.valueKey] : option.label">
        <slot v-if="slots.option" name="option" :option="option" />
      </ElOption>
    </template>
    <template v-if="slots.header" #header>
      <slot name="header" :field="fieldRef" />
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer" :field="fieldRef" />
    </template>
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="slots.empty" #empty>
      <slot name="empty" />
    </template>
    <template v-if="slots.tag" #tag>
      <slot name="tag" :field="fieldRef" />
    </template>
    <template v-if="slots.loading" #loading>
      <slot name="loading" />
    </template>
    <template v-if="slots.label" #label="{ label, value: labelValue }">
      <slot name="label" :label="label" :value="labelValue" />
    </template>
  </ElSelect>
</template>
