import type { DefineComponent, VNode } from 'vue'
import type { SlotTypes } from '.'
import { isFn, isNum, isStr } from '@formily/shared'
import { h, isVNode, toRaw } from 'vue'

export function resolveComponent(child?: SlotTypes, props?: Record<string, any>) {
  if (child) {
    if (isStr(child) || isNum(child)) {
      return child
    }
    else if (isFn(child)) {
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
