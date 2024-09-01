import { type DefineComponent, type VNode, h, isVNode, toRaw } from 'vue'
import type { SlotTypes } from '.'

export function resolveComponent(child?: SlotTypes, props?: Record<string, any>) {
  if (child) {
    if (typeof child === 'string' || typeof child === 'number') {
      return child
    }
    else if (typeof child === 'function') {
      return (child as (props) => VNode)(props)
    }
    else if (isVNode(child)) {
      return child
    }
    else {
      return h(toRaw(child as DefineComponent), props)
    }
  }
}
