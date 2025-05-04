import { connect, mapProps } from '@formily/vue'
import { ElTreeSelect } from 'element-plus'
import { mapReadPretty, transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

export type TreeSelectProps = typeof ElTreeSelect

const TransformElTreeSelect = transformComponent<TreeSelectProps>(
  ElTreeSelect,
  {
    change: 'update:modelValue',
  },
)

export const TreeSelect = connect(
  TransformElTreeSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly', dataSource: 'data' }),
  mapReadPretty(PreviewText.Select),
)

export default TreeSelect
