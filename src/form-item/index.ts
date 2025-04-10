import { connect, mapProps } from '@formily/vue'
import { composeExport } from '../__builtins__'
import FormBaseItem from './form-item.vue'
import './style.scss'

const Item = connect(
  FormBaseItem,
  mapProps({ validateStatus: true, title: 'label', required: true, description: 'extra' }),
)

export const FormItem = composeExport(Item, {
  BaseItem: FormBaseItem,
})

export default FormItem

export { default as FormBaseItem } from './form-item.vue'
