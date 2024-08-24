import { type Component, type VNode } from 'vue'

export type SlotTypes =
  | Component
  | string
  | number
  | ((props: Record<string, any>) => VNode[] | VNode)
  | VNode
