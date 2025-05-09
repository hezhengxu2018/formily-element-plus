import { observer } from '@formily/reactive-vue'
import { composeExport } from '../__builtins__/shared'
import { ArrayBase } from '../array-base'
import FArrayItemsItem from './array-items-item.vue'
import FArrayItemsInner from './array-items.vue'
import './style.scss'

export interface IArrayItemsItemProps {
  type?: 'card' | 'divide'
}

export const ArrayItemsInner = observer(FArrayItemsInner)

export const ArrayItemsItem = observer(FArrayItemsItem)

export const ArrayItems = composeExport(ArrayItemsInner, {
  Item: ArrayItemsItem,
  Index: ArrayBase.Index,
  SortHandle: ArrayBase.SortHandle,
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
  MoveDown: ArrayBase.MoveDown,
  MoveUp: ArrayBase.MoveUp,
  useArray: ArrayBase.useArray,
  useIndex: ArrayBase.useIndex,
  useRecord: ArrayBase.useRecord,
})

export default ArrayItems
