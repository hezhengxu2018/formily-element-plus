import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { ElCheckbox } from 'element-plus'
import { composeExport } from '../__builtins__/shared'
import { PreviewText } from '../preview-text'
import FCheckboxGroup from './checkbox-group.vue'

const CheckboxGroup = connect(
  FCheckboxGroup,
  mapProps({ dataSource: 'options', disabled: true }),
  mapReadPretty(PreviewText.Select, {
    multiple: true,
  }),
)

const FCheckbox = connect(
  ElCheckbox,
  mapProps({
    value: 'modelValue',
    disabled: true,
  }),
)

export const Checkbox = composeExport(FCheckbox, {
  Group: CheckboxGroup,
})

export default Checkbox
