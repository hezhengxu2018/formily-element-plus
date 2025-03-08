<script setup lang="ts">
import type { RadioProps } from 'element-plus'
import type { PropType } from 'vue'
import { ElRadio, ElRadioButton, ElRadioGroup, version } from 'element-plus'
import { isPlainObject } from 'lodash-es'
import { lt } from 'semver'
import { computed, useSlots } from 'vue'

defineOptions({
  name: 'FRadioGroup',
})

const props = defineProps({
  value: {
    default: undefined,
  },
  options: {
    type: Array as PropType<Array<RadioProps | string | number>>,
    default: () => [],
  },
  optionType: {
    type: String as PropType<'default' | 'button'>,
    default: 'default',
  },
})

const emits = defineEmits(['change'])
const OptionType = computed(() => {
  return props.optionType === 'button' ? ElRadioButton : ElRadio
})
const IS_LESS_THAN_2_6_0 = lt(version, '2.6.0')

// 添加类型守卫函数
function isRadioPropsObject(option: any): option is RadioProps {
  return isPlainObject(option)
}

const compatiableProps = computed(() => {
  return props.options.map((option) => {
    if (!isRadioPropsObject(option)) {
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
  <ElRadioGroup :model-value="props.value" @update:model-value="(value) => emits('change', value)">
    <template v-if="!slots.default">
      <component :is="OptionType" v-for="(option, index) of compatiableProps" :key="index" v-bind="option">
        {{ isRadioPropsObject(props.options[index]) ? props.options[index].label : option.label }}
      </component>
    </template>
    <template v-else>
      <component :is="OptionType" v-for="(option, index) of compatiableProps" :key="index" v-bind="option">
        <slot :option="option" />
      </component>
    </template>
  </ElRadioGroup>
</template>
