import { connect, mapProps, mapReadPretty } from '@formily/vue'
import FInput from './input.vue'
import { composeExport } from '../__builtins__'
import { PreviewText } from '../preview-text'

const InnerInput = connect(
  FInput,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
  }),
  mapReadPretty(PreviewText.Input),
)

const TextArea = connect(
  FInput,
  mapProps((props) => {
    return {
      ...props,
      modelValue: props.value,
      readonly: props.readOnly,
      type: 'textarea',
    }
  }),
  mapReadPretty(PreviewText.Input),
)

export const Input = composeExport(InnerInput, {
  TextArea,
})

export default Input
