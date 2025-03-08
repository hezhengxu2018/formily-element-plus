import type { RadioProps } from 'element-plus'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { ElRadio } from 'element-plus'
import { composeExport, transformComponent } from '../__builtins__/shared'
import { PreviewText } from '../preview-text'
import FRadioGroup from './radio-group.vue'
import './style.scss'

const TransformElRadio = transformComponent<RadioProps>(ElRadio, {
  change: 'update:modelValue',
})

const InnerRadio = connect(
  TransformElRadio,
  mapProps({
    value: 'modelValue',
    disabled: true,
  }),
)

const RadioGroup = connect(
  FRadioGroup,
  mapProps({ dataSource: 'options', disabled: true }),
  mapReadPretty(PreviewText.Select),
)
export const Radio = composeExport(InnerRadio, {
  Group: RadioGroup,
})

export default Radio
