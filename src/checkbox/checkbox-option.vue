<script setup lang="ts">
import type { CheckboxProps } from 'element-plus'
import type { PropType } from 'vue'
import { ElCheckbox, ElCheckboxButton, version } from 'element-plus'
import { lt } from 'semver'
import { computed } from 'vue'

defineOptions({
  name: 'FCheckboxOption',
  inheritAttrs: false,
})

const props = defineProps({
  option: Object as PropType<CheckboxProps>,
  optionType: String as PropType<'default' | 'button'>,
})
const emits = defineEmits(['change'])
const IS_LESS_THAN_2_6_0 = lt(version, '2.6.0')
const compatiableProps = computed(() => {
  if (props.option === undefined)
    return {}
  if (IS_LESS_THAN_2_6_0) {
    return {
      ...props.option,
      label: props.option.value,
    }
  }
  return props.option
})
</script>

<template>
  <template v-if="props.optionType === 'button'">
    <ElCheckboxButton
      v-bind="compatiableProps"
      @update:model-value="(value) => emits('change', value)"
    >
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        {{ props.option.label }}
      </template>
    </ElCheckboxButton>
  </template>
  <template v-else>
    <ElCheckbox
      v-if="$slots.default"
      v-bind="compatiableProps"
      @update:model-value="(value) => emits('change', value)"
    >
      <slot />
    </ElCheckbox>
    <ElCheckbox
      v-else
      v-bind="compatiableProps"
      @update:model-value="(value) => emits('change', value)"
    >
      {{ props.option?.label }}
    </ElCheckbox>
  </template>
</template>
