import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { ElOption, ElSelect } from 'element-plus'
import { defineComponent, h } from 'vue'
import { transformComponent } from '../__builtins__'

import { PreviewText } from '../preview-text'

export type SelectProps = typeof ElSelect & {
  options?: Array<typeof ElOption>
}

const TransformElSelect = transformComponent<SelectProps>(ElSelect, {
  change: 'update:modelValue',
})

const InnerSelect = connect(
  TransformElSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly' }),
  mapReadPretty(PreviewText.Select),
)

const SelectOption = defineComponent({
  name: 'FSelect',
  props: ['options'],
  setup(customProps, { attrs, slots }) {
    return () => {
      const options = customProps.options || []
      const children
        = options.length > 0
          ? {
              default: () =>
                options.map((option: any) => {
                  return typeof option === 'string'
                    ? h(
                        ElOption,
                        { key: option, value: option, label: option },
                        {
                          default: () =>
                            slots?.option?.({
                              option: { label: option, value: option },
                            }) ?? option,
                        },
                      )
                    : h(
                        ElOption,
                        {
                          key: option.value,
                          ...option,
                        },
                        {
                          default: () =>
                            slots?.option?.({ option })
                            ?? option.label
                            ?? option.value,
                        },
                      )
                }),
            }
          : slots
      return h(
        InnerSelect,
        {
          ...attrs,
        },
        children,
      )
    }
  },
})

export const Select = connect(
  SelectOption,
  mapProps({ dataSource: 'options', loading: true }),
  mapReadPretty(PreviewText.Select),
)

export default Select
