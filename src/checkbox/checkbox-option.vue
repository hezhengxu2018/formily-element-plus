<script setup lang="ts">
import type { CheckboxProps } from 'element-plus'
import type { PropType } from 'vue'
import { ElCheckbox, ElCheckboxButton } from 'element-plus'

defineOptions({
  name: 'FCheckboxOption',
  inheritAttrs: false,
})

const props = defineProps({
  option: Object as PropType<CheckboxProps>,
  optionType: String as PropType<'default' | 'button'>,
})
const emits = defineEmits(['change'])
</script>

<template>
  <template v-if="props.optionType === 'button'">
    <ElCheckboxButton
      v-bind="props.option"
      @update:model-value="(value) => emits('change', value)"
    >
      <slot />
    </ElCheckboxButton>
  </template>
  <template v-else>
    <ElCheckbox
      v-if="$slots.default"
      v-bind="props.option"
      @update:model-value="(value) => emits('change', value)"
    >
      <slot />
    </ElCheckbox>
    <ElCheckbox
      v-else
      v-bind="props.option"
      @update:model-value="(value) => emits('change', value)"
    />
  </template>
</template>
