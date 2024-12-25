import type { Component, PropType } from 'vue'
import type { SlotTypes } from '../__builtins__/shared'
import { isStr } from '@formily/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import {
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  version,
} from 'element-plus'
import { lt } from 'semver'
import { defineComponent, h } from 'vue'
import {
  composeExport,
  resolveComponent,
  transformComponent,
} from '../__builtins__/shared'

import { PreviewText } from '../preview-text'

type ElCheckboxProps = Omit<typeof ElCheckbox, 'value'> & {
  value: ElCheckboxProps['label']
}

type OptionType = Partial<{
  label: string
  value: string
}>

export interface CheckboxProps extends ElCheckboxProps {
  option: Omit<typeof ElCheckbox, 'value'> & {
    value: ElCheckboxProps['label']
    label: SlotTypes
  }
}

const CheckboxOption = defineComponent({
  name: 'FCheckbox',
  inheritAttrs: false,
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  setup(customProps, { attrs, slots }) {
    return () => {
      const props = attrs as unknown as CheckboxProps
      const isBelow260 = lt(version, '2.6.0')
      // 文档中没有写明的属性，一般由CheckboxOption传入
      if (customProps.option) {
        const option = customProps.option
        const unifiedOption = isStr(option)
          ? { ...props, label: option, value: option }
          : { ...props, ...option }

        const children = {
          default: () => [
            resolveComponent(slots.default ?? option.label, { option }),
          ],
        }

        return h(
          attrs.optionType === 'button' ? ElCheckboxButton : ElCheckbox,
          isBelow260
            ? { ...unifiedOption, label: option.value }
            : { ...unifiedOption },
          children,
        )
      }

      return h(
        attrs.optionType === 'button' ? ElCheckboxButton : ElCheckbox,
        isBelow260
          ? { ...props, label: attrs.value }
          : { ...props },
        {
          default:
            isBelow260
              ? slots.default ?? customProps.option.label
              : slots.default,
        },
      )
    }
  },
})

export type CheckboxGroupProps = typeof ElCheckboxGroup & {
  value: any[]
  options?: Array<CheckboxProps | string>
  optionType: 'default' | 'button'
}

const TransformElCheckboxGroup = transformComponent(ElCheckboxGroup, {
  change: 'update:modelValue',
})

const CheckboxGroupOption: Component = defineComponent({
  name: 'FCheckboxGroup',
  props: {
    options: {
      type: Array as PropType<Array<OptionType>>,
      default: () => [],
    },
    optionType: {
      type: String as PropType<CheckboxGroupProps['optionType']>,
      default: 'default',
    },
  },
  setup(customProps, { attrs, slots }) {
    return () => {
      const children
        = customProps.options?.length > 0
          ? {
              default: () =>
                customProps.options.map((option) => {
                  return h(CheckboxOption, {
                    option,
                    optionType: customProps.optionType,
                  }, slots?.option
                    ? { default: () => slots.option({ option }) }
                    : { default: () => option.label })
                }),
            }
          : slots
      return h(
        TransformElCheckboxGroup,
        {
          ...attrs,
        },
        children,
      )
    }
  },
})

const CheckboxGroup = connect(
  CheckboxGroupOption,
  mapProps({ dataSource: 'options', value: 'modelValue' }),
  mapReadPretty(PreviewText.Select, {
    multiple: true,
  }),
)

const InnerCheckbox = connect(
  CheckboxOption,
  mapProps({
    value: 'modelValue',
  }),
)

export const Checkbox = composeExport(InnerCheckbox, {
  Group: CheckboxGroup,
})

export default Checkbox
