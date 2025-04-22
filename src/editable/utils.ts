import type { Field } from '@formily/core'
import type { Ref } from 'vue'
import type { IFormItemProps } from '../form-item/types'
import { isVoidField } from '@formily/core'

export function getParentPattern(fieldRef: Ref<Field>) {
  const field = fieldRef.value
  return field?.parent?.pattern || field?.form?.pattern
}

export function getFormItemProps(fieldRef: Ref<Field>): IFormItemProps {
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
