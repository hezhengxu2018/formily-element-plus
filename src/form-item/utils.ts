import type { Field } from '@formily/core'
import type { IFormItemProps } from './types'
import { isArr } from '@formily/shared'

export function getFeedbackMessage(field: Field, props: IFormItemProps) {
  if (field.validating)
    return
  if (props.feedbackText)
    return props.feedbackText

  const messages = {
    errors: field.selfErrors.join(', '),
    warnings: field.selfWarnings.join(', '),
    successes: field.selfSuccesses.join(', '),
  }

  return messages.errors || messages.warnings || messages.successes
}

export function determineFeedbackStatus(field: Field) {
  if (field.validateStatus === 'validating')
    return 'pending'
  return isArr(field.decorator)
    ? (field.decorator[1]?.feedbackStatus ?? field.validateStatus)
    : field.validateStatus
}
