<script setup lang="ts">
import type { CheckboxProps } from 'element-plus'
import type { PropType } from 'vue'
import { computed, useSlots } from "vue";
import { ElCheckboxGroup, ElCheckbox, ElCheckboxButton, version } from 'element-plus'
import { lt } from 'semver'

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

const OptionType = computed(() => {
  return props.optionType === 'button' ? ElCheckboxButton : ElCheckbox
})
const IS_LESS_THAN_2_6_0 = lt(version, '2.6.0')
const compatiableProps = computed(() => {
  return props.options.map(option => {
    if (IS_LESS_THAN_2_6_0) {
      return {
        ...option,
        label: option.value,
      }
    }
    return option
  })
})

const emits = defineEmits(['change'])
const slots = useSlots()
</script>

<template>
  <ElCheckboxGroup :model-value="props.value" @update:model-value="(value)=> emits('change', value)">
    <template v-if="!slots.default">
      <component :is="OptionType" v-for="(option, index) of compatiableProps" :key="index" v-bind="option">
        {{ $props.options[index].label }}
      </component>
    </template>
    <template v-else>
      <component :is="OptionType" v-for="(option, index) of compatiableProps" :key="index" v-bind="option">
        <slot :option="option" />
      </component>
    </template>
  </ElCheckboxGroup>
</template>
