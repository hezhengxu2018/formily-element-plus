<script setup lang="ts">
import type { CheckboxProps } from 'element-plus'
import type { PropType } from 'vue'
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup, version } from 'element-plus'
import { isPlainObject } from 'lodash-es'
import { lt } from 'semver'
import { computed, useSlots } from 'vue'

defineOptions({
  name: 'FCheckboxGroup',
})

const props = defineProps({
  value: {
    type: Array as PropType<Array<any>>,
    default: () => [],
  },
  options: {
    type: Array as PropType<Array<CheckboxProps>>,
    default: () => [],
  },
  optionType: {
    type: String as PropType<'default' | 'button'>,
    default: 'default',
  },
})

const emits = defineEmits(['change'])
const OptionType = computed(() => {
  return props.optionType === 'button' ? ElCheckboxButton : ElCheckbox
})
const IS_LESS_THAN_2_6_0 = lt(version, '2.6.0')
const compatiableProps = computed(() => {
  return props.options.map((option) => {
    if (!isPlainObject(option)) {
      return {
        label: option,
        value: option,
      }
    }
    if (IS_LESS_THAN_2_6_0) {
      return {
        ...option,
        label: option.value,
      }
    }
    return option
  })
})

const slots = useSlots()
</script>

<template>
  <ElCheckboxGroup :model-value="props.value" @update:model-value="(value) => emits('change', value)">
    <template v-if="!slots.option">
      <component :is="OptionType" v-for="(option, index) of compatiableProps" :key="index" v-bind="option">
        {{ isPlainObject(props.options[index]) ? props.options[index]?.label : option.label }}
      </component>
    </template>
    <template v-else>
      <component :is="OptionType" v-for="(option, index) of compatiableProps" :key="index" v-bind="option">
        <slot name="option" :option="option" />
      </component>
    </template>
  </ElCheckboxGroup>
</template>
