import type { Slot, VNode } from 'vue'
import { Fragment } from 'vue'

export function isValidElement(element) {
  return (
    isVueOptions(element)
    || (element
      && typeof element === 'object'
      && 'componentOptions' in element
      && 'context' in element
      && element.tag !== undefined)
  ) // remove text node
}

export function isVnode(element: any): boolean {
  return (
    element
    && typeof element === 'object'
    && 'componentOptions' in element
    && 'context' in element
    && element.tag !== undefined
  )
}

export function isVueOptions(options: any) {
  return (
    options
    && (typeof options.template === 'string'
      || typeof options.render === 'function')
  )
}

export function composeExport<T0 extends object, T1 extends object>(
  s0: T0,
  s1: T1,
): T0 & T1 {
  return Object.assign(s0, s1)
}

export function isVnodeEmpty(vnodes: Array<VNode>) {
  return vnodes.every((node: VNode) => {
    if (node.type === Comment) {
      return true
    }

    if (node.type === Text && typeof node.children === 'string' && !node.children.trim()) {
      return true
    }

    if (
      node.type === Fragment
      && isVnodeEmpty(node.children as Array<VNode>)
    ) {
      return true
    }

    return false
  })
}

export function hasSlotContent(slot: Slot<any> | undefined) {
  if (!slot) {
    return false
  }
  return !isVnodeEmpty(slot())
}
