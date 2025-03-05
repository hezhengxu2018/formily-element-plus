<script lang="ts" setup>
import type { PropType } from 'vue'
import type { RadioGroupProps } from './index'
import { ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus'
import { computed } from 'vue'
import { resolveComponent } from '../__builtins__/shared'

defineOptions({
  name: 'FRadioGroup',
})

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  optionType: {
    type: String as PropType<RadioGroupProps['optionType']>,
    default: 'default',
  },
})

const OptionType = computed(() =>
  props.optionType === 'button' ? ElRadioButton : ElRadio,
)
</script>

<template>
  <ElRadioGroup v-bind="$attrs">
    <template v-if="props.options.length > 0">
      <component
        :is="OptionType"
        v-for="option in options"
        :key="typeof option === 'string' ? option : option.value"
        v-bind="typeof option === 'string' ? { label: option } : { ...option, value: undefined, label: option.value }"
      >
        <slot
          v-if="$slots.option"
          name="option"
          :option="option"
        />
        <template v-else>
          {{ typeof option === 'string' ? option : option.label }}
        </template>
      </component>
    </template>
    <slot v-else />
  </ElRadioGroup>
</template>
