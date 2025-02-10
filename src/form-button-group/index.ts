import type { SpaceProps } from '../space'
import { ElSpace } from 'element-plus'
import { defineComponent, h } from 'vue'
import { stylePrefix } from '../__builtins__'
import { FormBaseItem } from '../form-item'

export type FormButtonGroupProps = Omit<SpaceProps, 'align' | 'size'> & {
  align?: 'left' | 'right' | 'center'
  gutter?: number
  className?: string
  alignFormItem: boolean
}

export const FormButtonGroup = defineComponent({
  name: 'FFormButtonGroup',
  props: {
    align: {
      type: String,
      default: 'left',
    },
    gutter: {
      type: Number,
      default: 8,
    },
    alignFormItem: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs }) {
    const prefixCls = `${stylePrefix}-form-button-group`
    return () => {
      return props.alignFormItem
        ? h(
            FormBaseItem,
            {
              colon: false,
              label: ' ',
              ...attrs,
              style: {
                margin: 0,
                padding: 0,
                width: '100%',
              },
            },
            {
              default: () => h(ElSpace, { size: props.gutter }, slots.default?.()),
            },
          )
        : h(
            ElSpace,
            {
              ...attrs,
              class: [prefixCls],
              style: {
                justifyContent:
                props.align === 'left'
                  ? 'flex-start'
                  : (props.align === 'right'
                      ? 'flex-end'
                      : 'center'),
                display: 'flex',
              },
              size: props.gutter,
            },
            slots.default?.(),
          )
    }
  },
})

export default FormButtonGroup
