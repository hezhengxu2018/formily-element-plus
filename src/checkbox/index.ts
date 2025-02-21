import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { composeExport } from '../__builtins__/shared'
import { PreviewText } from '../preview-text'
import CheckboxGroupOption from './checkbox-group-option.vue'
import CheckboxOption from './checkbox-option.vue'

const CheckboxGroup = connect(
  CheckboxGroupOption,
  mapProps({ dataSource: 'options', value: 'modelValue' }),
  mapReadPretty(PreviewText.Select, {
    multiple: true,
  }),
)

const InnerCheckbox = connect(
  CheckboxOption,
  mapProps({
    value: 'modelValue',
  }),
)

export const Checkbox = composeExport(InnerCheckbox, {
  Group: CheckboxGroup,
})

export default Checkbox
