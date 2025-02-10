import type { Field } from '@formily/core'
import type { Ref } from 'vue'
import type { FormItemProps } from '../form-item'
import { ChatDotRound, Close, Edit } from '@element-plus/icons-vue'
import { isVoidField } from '@formily/core'
import { reaction } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { useField } from '@formily/vue'
import { ElPopover } from 'element-plus'

import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { composeExport } from '../__builtins__/shared'
import { FormBaseItem } from '../form-item'
import './style.scss'

export type EditableProps = FormItemProps
export type EditablePopoverProps = typeof ElPopover

function getParentPattern(fieldRef: Ref<Field>) {
  const field = fieldRef.value
  return field?.parent?.pattern || field?.form?.pattern
}

function getFormItemProps(fieldRef: Ref<Field>): FormItemProps {
  const field = fieldRef.value

  if (isVoidField(field))
    return {}
  if (!field)
    return {}
  const takeMessage = () => {
    if (field.selfErrors.length > 0)
      return field.selfErrors[0]
    if (field.selfWarnings.length > 0)
      return field.selfWarnings[0]
    if (field.selfSuccesses.length > 0)
      return field.selfSuccesses[0]
  }

  return {
    feedbackStatus:
      field.validateStatus === 'validating' ? 'pending' : field.validateStatus,
    feedbackText: takeMessage(),
    extra: field.description,
  }
}

const EditableInner = observer(
  defineComponent<EditableProps>({
    name: 'FEditable',
    setup(props, { attrs, slots }) {
      const fieldRef = useField<Field>()
      const innerRef = ref<HTMLElement | null>(null)
      onMounted(() => {
        innerRef.value = document.body
      })

      const prefixCls = `${stylePrefix}-editable`
      const setEditable = (payload: boolean) => {
        const pattern = getParentPattern(fieldRef)

        if (pattern !== 'editable')
          return
        fieldRef.value.setPattern(payload ? 'editable' : 'readPretty')
      }

      const dispose = reaction(
        () => {
          const pattern = getParentPattern(fieldRef)

          return pattern
        },
        (pattern) => {
          if (pattern === 'editable') {
            fieldRef.value.setPattern('readPretty')
          }
        },
        {
          fireImmediately: true,
        },
      )

      onBeforeUnmount(dispose)

      return () => {
        const field = fieldRef.value
        const editable = field.pattern === 'editable'
        const pattern = getParentPattern(fieldRef)
        const itemProps = getFormItemProps(fieldRef)

        const recover = () => {
          if (editable && !fieldRef.value?.errors?.length) {
            setEditable(false)
          }
        }

        const onClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement
          const close = innerRef.value.querySelector(`.${prefixCls}-close-btn`)

          if (target?.contains(close) || close?.contains(target)) {
            recover()
          }
          else if (!editable) {
            setTimeout(() => {
              setEditable(true)
              setTimeout(() => {
                innerRef.value.querySelector('input')?.focus()
              })
            })
          }
        }

        const renderEditHelper = () => {
          if (editable)
            return null

          return h(
            FormBaseItem,
            {
              ...attrs,
              ...itemProps,
            },
            {
              default: () => {
                return h(
                  pattern === 'editable' ? Edit : ChatDotRound,
                  {
                    class: [`${prefixCls}-edit-btn`],
                  },
                  {},
                )
              },
            },
          )
        }

        const renderCloseHelper = () => {
          if (!editable)
            return null
          return h(
            FormBaseItem,
            {
              ...attrs,
            },
            {
              default: () => {
                return h(
                  Close,
                  {
                    class: [`${prefixCls}-close-btn`],
                  },
                  {},
                )
              },
            },
          )
        }

        return h(
          'div',
          {
            class: prefixCls,
            ref: innerRef,
            onClick,
          },
          h(
            'div',
            {
              class: `${prefixCls}-content`,
            },
            [
              h(
                FormBaseItem,
                {
                  ...attrs,
                  ...itemProps,
                },
                slots,
              ),
              renderEditHelper(),
              renderCloseHelper(),
            ],
          ),
        )
      }
    },
  }),
)

const EditablePopover = observer(
  defineComponent<EditablePopoverProps>({
    name: 'FEditablePopover',
    setup(props, { attrs, slots }) {
      const fieldRef = useField<Field>()

      const prefixCls = `${stylePrefix}-editable`
      const visible = ref(false)

      return () => {
        const field = fieldRef.value
        const pattern = getParentPattern(fieldRef)
        return h(
          ElPopover as any,
          {
            ...attrs,
            class: [prefixCls].concat(attrs.class as string[]),
            title: attrs.title || field.title,
            value: visible.value,
            trigger: 'click',
            onInput: (value: any) => {
              visible.value = value
            },
          },
          {
            default: slots.default,
            reference: () =>
              h(
                'div',
                { class: prefixCls },
                h(
                  FormBaseItem,
                  { class: [`${prefixCls}-trigger`] },
                  {
                    default: () =>
                      h(
                        'div',
                        {
                          class: [`${prefixCls}-content`],
                        },
                        [
                          h(
                            'span',
                            {
                              class: [`${prefixCls}-preview`],
                            },
                            attrs.title || field.title,
                          ),
                          h(
                            pattern === 'editable' ? Edit : ChatDotRound,
                            {
                              class: [`${prefixCls}-edit-btn`],
                            },
                            {},
                          ),
                        ],
                      ),
                  },
                ),
              ),
          },
        )
      }
    },
  }),
)

export const Editable = composeExport(EditableInner, {
  Popover: EditablePopover,
}) as any

export default Editable
