import type { Ref } from 'vue'
import { observer } from '@formily/reactive-vue'
import { isValid } from '@formily/shared'
import { computed } from 'vue'
import {
  composeExport,
  createContext,
  resolveComponent,
  useContext,
} from '../__builtins__/shared'
import Cascader from './cascader.vue'
import DatePicker from './date-picker.vue'
import Input from './input.vue'
import Select from './select.vue'
import Text from './text.vue'
import TimePicker from './time-picker.vue'

const PlaceholderContext = createContext('N/A')

export function usePlaceholder(value?: Ref<any>) {
  const placeholderCtx = useContext(PlaceholderContext)
  const placeholder = computed(() => {
    return isValid(value?.value) && value?.value !== ''
      ? value?.value || 'N/A'
      : resolveComponent(placeholderCtx.value) || 'N/A'
  })
  return placeholder
}

export const PreviewText = composeExport(Text, {
  Input,
  Select: observer(Select),
  Cascader,
  DatePicker,
  TimePicker,
  Placeholder: PlaceholderContext.Provider,
  usePlaceholder,
})

export default PreviewText
