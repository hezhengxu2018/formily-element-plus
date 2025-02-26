import type { PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import FFormCollapse from "./form-collapse.vue";
import { createFormCollapse } from "./utils";
import { defineComponent, Fragment, h } from 'vue'
import { composeExport } from '../__builtins__'
import './style.scss'

const FormCollapse = observer(FFormCollapse)

export const FormCollapseItem = defineComponent({
  name: 'FFormCollapseItem',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h(Fragment, slots.default?.())
  },
})

const composeFormCollapse = composeExport(FormCollapse, {
  Item: FormCollapseItem,
  createFormCollapse,
})

export { composeFormCollapse as FormCollapse }
export default composeFormCollapse
