import { DefineComponent, h, toRaw, isVNode, type VNode } from 'vue'
import { SlotTypes } from '.'

export const resolveComponent = (
  child?: SlotTypes,
  props?: Record<string, any>,
) => {
  if (child) {
    if (typeof child === 'string' || typeof child === 'number') {
      return child
    } else if (typeof child === 'function') {
      return (child as (props) => VNode)(props)
    } else if (isVNode(child)) {
      return child
    } else {
      return h(toRaw(child as DefineComponent), props)
    }
  }

  return
}
