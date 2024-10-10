import type { Component, PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { isStr } from '@formily/shared'
import {
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  version,
} from 'element-plus'
import { lt } from 'semver'
import type { SlotTypes } from '../__builtins__/shared'
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
  setup(curtomProps, { attrs, slots }) {
    return () => {
      const props = attrs as unknown as CheckboxProps
      const option = curtomProps?.option
      if (option) {
        const children = {
          default: () => [
            resolveComponent(slots.default ?? option.label, { option }),
          ],
        }
        const newProps = {} as Partial<ElCheckboxProps>
        Object.assign(newProps, option)
        newProps.label = option.value
        delete newProps.value

        return h(
          attrs.optionType === 'button' ? ElCheckboxButton : ElCheckbox,
          {
            ...newProps,
          },
          children,
        )
      }

      return h(
        ElCheckbox,
        {
          ...props,
        },
        slots,
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
      type: Array,
      default: () => [],
    },
    optionType: {
      type: String as PropType<CheckboxGroupProps['optionType']>,
      default: 'default',
    },
  },
  setup(customProps, { attrs, slots }) {
    const isBelow260 = lt(version, '2.6.0')
    // 统一使用2.6.0之后的方式设置label与value
    const unifiedOptions = computed<Array<OptionType>>(() => {
      const options = customProps.options || []
      return options.map((option: OptionType) => {
        if (isStr(option))
          return { label: option, value: option }
        return option
      })
    })

    return () => {
      const children
        = unifiedOptions.value.length > 0
          ? {
              default: () =>
                unifiedOptions.value.map((option) => {
                  return isBelow260
                    ? h(
                      ElCheckbox,
                      {
                        label: option.value,
                        optionType: customProps.optionType,
                      },
                      slots?.option
                        ? { default: () => slots.option({ option }) }
                        : { default: () => option.label },
                    )
                    : h(
                      ElCheckbox,
                      {
                        ...option,
                        optionType: customProps.optionType,
                      },
                      slots?.option
                        ? { default: () => slots.option({ option }) }
                        : {},
                    )
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
