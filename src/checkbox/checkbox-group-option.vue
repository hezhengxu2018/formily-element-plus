<script setup lang="ts">
import type { CheckboxProps } from 'element-plus'
import type { PropType } from 'vue'
import { ElCheckboxGroup } from 'element-plus'
import { useSlots } from 'vue'
import { transformComponent } from '../__builtins__/shared'
import FCheckboxOption from './checkbox-option.vue'

defineOptions({
  name: 'FCheckboxGroup',
})

const props = defineProps({
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
const TransformElCheckboxGroup = transformComponent(ElCheckboxGroup, {
  change: 'update:modelValue',
})
const slots = useSlots()
</script>

<template>
  <TransformElCheckboxGroup @update:model-value="(value) => emits('change', value)">
    <template v-if="!slots.default">
      <FCheckboxOption
        v-for="(option, index) of props.options"
        :key="index"
        :option="option"
        :option-type="props.optionType"
      />
    </template>
    <template v-else>
      <FCheckboxOption
        v-for="(option, index) of props.options"
        :key="index"
        :option="option"
        :option-type="props.optionType"
      >
        <slot :option="option" />
      </FCheckboxOption>
    </template>
  </TransformElCheckboxGroup>
</template>
