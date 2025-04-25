import { model } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { composeExport } from '../__builtins__'
import FFormTab from './form-tab.vue'
import './style.scss'

function createFormTab(defaultActiveKey?: string) {
  const formTab = model({
    activeKey: defaultActiveKey,
    setActiveKey(key: string) {
      formTab.activeKey = key
    },
  })
  return formTab
}

const FormTab = observer(FFormTab)

export const composeFormTab = composeExport(FormTab, {
  createFormTab,
})

export { composeFormTab as FormTab }
export default composeFormTab
