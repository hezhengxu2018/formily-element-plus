import type { ElPopover } from 'element-plus'
import type { IFormItemProps } from '../form-item/types'
import { observer } from '@formily/reactive-vue'
import { composeExport } from '../__builtins__/shared'
import FEditablePopover from './editable-popover.vue'
import FEditable from './editable.vue'
import './style.scss'

export type EditableProps = IFormItemProps
export type EditablePopoverProps = typeof ElPopover

const EditableInner = observer(FEditable)

const EditablePopover = observer(FEditablePopover)

export const Editable = composeExport(EditableInner, {
  Popover: EditablePopover,
}) as any

export default Editable
