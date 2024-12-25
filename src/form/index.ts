import type { Form as FormType, IFormFeedback } from '@formily/core'
import type { Component, SetupContext, VNode } from 'vue'
import type { FormLayoutProps } from '../form-layout'
import { FormProvider as _FormProvider, h, useForm } from '@formily/vue'

import { defineComponent } from 'vue'
import { FormLayout } from '../form-layout'
import { PreviewText } from '../preview-text'

const FormProvider = _FormProvider as unknown as Component

export interface FormProps extends FormLayoutProps {
  form?: FormType
  component?: Component
  previewTextPlaceholder: string | (() => VNode)
  onAutoSubmit?: (values: any) => any
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void
}

export const Form = defineComponent({
  name: 'FForm',
  props: [
    'form',
    'component',
    'previewTextPlaceholder',
    'onAutoSubmit',
    'onAutoSubmitFailed',
  ],
  setup(props: FormProps, { attrs, slots }: SetupContext) {
    const top = useForm()

    return () => {
      const {
        form,
        component = 'form',
        onAutoSubmit = attrs.onAutoSubmit,
        onAutoSubmitFailed = attrs.autoSubmitFailed,
        previewTextPlaceholder = slots?.previewTextPlaceholder,
      } = props

      const renderContent = (form: FormType) => {
        return h(
          PreviewText.Placeholder,
          {
            value: previewTextPlaceholder,
          },
          {
            default: () => [
              h(FormLayout, { attrs }, {
                default: () => [
                  h(
                    component,
                    {
                      onSubmit: (e: Event) => {
                        e?.stopPropagation?.()
                        e?.preventDefault?.()
                        form
                          .submit(onAutoSubmit as (e: any) => void)
                          .catch(onAutoSubmitFailed as (e: any) => void)
                      },
                    },
                    slots,
                  ),
                ],
              }),
            ],
          },
        )
      }

      if (form) {
        return h(
          FormProvider,
          { form },
          {
            default: () => renderContent(form),
          },
        )
      }

      if (!top.value)
        throw new Error('must pass form instance by createForm')

      return renderContent(top.value)
    }
  },
})

export default Form
