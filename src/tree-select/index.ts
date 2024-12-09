import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { ElTreeSelect } from 'element-plus'
import { PreviewText } from '../preview-text'
import { transformComponent } from '../__builtins__'

export type TreeSelectProps = typeof ElTreeSelect

const TransformElTreeSelect = transformComponent<TreeSelectProps>(
  ElTreeSelect,
  {
    change: 'update:modelValue',
  },
)

export const TreeSelect = connect(
  TransformElTreeSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly' }),
  mapReadPretty(PreviewText.Select),
)

export default TreeSelect
