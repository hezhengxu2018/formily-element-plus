import { composeExport } from '../__builtins__/shared'
import Cascader from './cascader.vue'
import DatePicker from './date-picker.vue'
import Input from './input.vue'
import Preview from './preview.vue'
import Select from './select.vue'
import TimePicker from './time-picker.vue'

export const PreviewText = composeExport(Preview, {
  Input,
  Select,
  Cascader,
  DatePicker,
  TimePicker,
})

export default PreviewText
