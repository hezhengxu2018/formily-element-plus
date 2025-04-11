import { isVoidField } from '@formily/core'
import { connect, mapProps } from '@formily/vue'
import { composeExport } from '../__builtins__'
import FormBaseItem from './form-item.vue'
import { determineFeedbackStatus, getFeedbackMessage } from './utils'
import './style.scss'

const Item = connect(
  FormBaseItem,
  mapProps(
    {
      validateStatus: true,
      title: 'label',
      required: true,
      description: 'extra',
    },
    (props, field) => {
      if (isVoidField(field) || !field) {
        return props
      }

      const feedbackText = getFeedbackMessage(field, props)
      const feedbackStatus = determineFeedbackStatus(field)
      const asterisk = 'asterisk' in props 
        ? props.asterisk 
        : field.required && field.pattern !== 'readPretty'

      return {
        ...props,
        feedbackText,
        feedbackStatus,
        asterisk,
      }
    },
  ),
)

export const FormItem = composeExport(Item, {
  BaseItem: FormBaseItem,
})

export default FormItem

export { default as FormBaseItem } from './form-item.vue'
