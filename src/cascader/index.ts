import type { Field } from '@formily/core'
import { isVoidField } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import { useField } from '@formily/vue'
import { ElCascader } from 'element-plus'
import { defineComponent, h } from 'vue'

import { PreviewText } from '../preview-text'

export type CascaderProps = typeof ElCascader

// export const Cascader = connect(
//   ElCascader,
//   mapProps({ dataSource: 'options', value: 'modelValue' }),
//   mapReadPretty(PreviewText.Cascader)
// )

export const Cascader = observer(
  defineComponent({
    name: 'FCascader',
    props: ['onChange'],
    setup(props, { attrs, slots }: { [key: string]: any }) {
      const fieldRef = useField()
      return () => {
        const field = fieldRef.value as Field
        const Comp
          = field && !isVoidField(field) && field.pattern === 'readPretty'
            ? PreviewText.Cascader
            : ElCascader
        return h(
          Comp,
          {
            ...attrs,
            options: field?.dataSource,
            modelValue: field?.value,
            onChange: (...args: any[]) => {
              props.onChange(...args)
            },
          },
          slots,
        )
      }
    },
  }),
)

export default Cascader
