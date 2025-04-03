import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { ElButton as ElButtonProps, ElDrawer as ElDrawerProps } from 'element-plus'
import type { Component, VNode } from 'vue'

export type IFormDrawerProps = Omit<typeof ElDrawerProps, 'title'> & {
  cancelText?: string | Component | VNode | (() => VNode)
  cancelButtonProps?: typeof ElButtonProps
  okText?: string | Component | VNode | (() => VNode)
  okButtonProps?: typeof ElButtonProps
  loadingText?: string
}

export interface FormDrawerSlotContent {
  header: (props: {
    resolve: (type?: string) => void
    reject: () => void
    form: Form
  }) => any
  default: () => any
  footer: (props: {
    resolve: (type?: string) => void
    reject: () => void
    form: Form
  }) => any
}

export interface IFormDrawer {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  forConfirm: (middleware: IMiddleware<Form>) => IFormDrawer
  forCancel: (middleware: IMiddleware<Form>) => IFormDrawer
  [key: `for${string}`]: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  open: (props?: IFormProps) => Promise<any>
  close: () => void
}
