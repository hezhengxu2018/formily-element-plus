import type { IFieldResetOptions } from '@formily/core'
import type { ElButton as ElButtonProps } from 'element-plus'
import { observer } from '@formily/reactive-vue'
import { h, useParentForm } from '@formily/vue'

import { ElButton } from 'element-plus'
import { defineComponent } from 'vue'

export type ResetProps = IFieldResetOptions & typeof ElButtonProps

export const Reset = observer(
  defineComponent({
    name: 'FReset',
    props: {
      forceClear: {
        type: Boolean,
        default: false,
      },
      validate: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { attrs, slots }: any) {
      const formRef = useParentForm()
      return () => {
        const form = formRef?.value
        return h(
          ElButton,
          {
            ...attrs,
            onClick: (e: MouseEvent) => {
              if (attrs?.onClick && attrs.onClick(e) === false)
                return
              form
                ?.reset('*', {
                  forceClear: props.forceClear,
                  validate: props.validate,
                })
                .then(attrs.onResetValidateSuccess as (e: any) => void)
                .catch(attrs.onResetValidateFailed as (e: any) => void)
            },
          },
          slots,
        )
      }
    },
  }),
)

export default Reset
