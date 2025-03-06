import { observer } from '@formily/reactive-vue'
import { composeExport } from '../__builtins__'
import FFormGridColumn from './form-grid-column.vue'
import FFormGrid from './form-grid.vue'
import { createFormGrid, useFormGrid, useGridColumn } from './hooks'
import './style.scss'

const FormGridInner = observer(FFormGrid)

const FormGridColumn = observer(FFormGridColumn)

export const FormGrid = composeExport(FormGridInner, {
  GridColumn: FormGridColumn,
  useFormGrid,
  useGridColumn,
  createFormGrid,
})

export default FormGrid
