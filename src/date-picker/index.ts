import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { ElDatePicker } from 'element-plus'
import { transformComponent } from '../__builtins__/shared'

import { PreviewText } from '../preview-text'

export type DatePickerProps = typeof ElDatePicker

const TransformElDatePicker = transformComponent<DatePickerProps>(
  ElDatePicker,
  {
    change: 'update:modelValue',
  },
)

function getDefaultFormat(props: DatePickerProps, formatType = 'format') {
  const type = props.type

  if (type === 'week' && formatType === 'format') {
    return '[Week] ww'
  }
  else {
    switch (type) {
      case 'month': {
        return 'YYYY-MM'
      }
      case 'year': {
        return 'YYYY'
      }
      case 'datetime':
      case 'datetimerange': {
        return 'YYYY-MM-DD HH:mm:ss'
      }
 // No default
    }
  }

  return 'YYYY-MM-DD'
}

export const DatePicker = connect(
  TransformElDatePicker,
  mapProps(
    {
      value: 'modelValue',
      readOnly: 'readonly',
    },
    (props: any) => {
      return {
        ...props,
        format: props.format || getDefaultFormat(props),
        valueFormat:
          props.valueFormat || getDefaultFormat(props, 'valueFormat'),
      }
    },
  ),
  mapReadPretty(PreviewText.DatePicker),
)

export default DatePicker
