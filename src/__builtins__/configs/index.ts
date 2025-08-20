import { version } from 'element-plus'
import { lt } from '../shared'

export const stylePrefix = 'formily-element-plus'

export function compatibleUnderlineFalse() {
  /* istanbul ignore next -- @preserve */
  return lt(version, '2.9.9') ? false : 'never'
}

export function compatibleRadioValue(key: string) {
  return lt(version, '2.6.0') ? { label: key } : { value: key }
}
