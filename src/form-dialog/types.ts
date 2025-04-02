import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { ButtonProps, DialogProps } from 'element-plus'
import type { Component, VNode } from 'vue'

export type IFormDialogProps = Partial<DialogProps> & {
  cancelText?: string
  cancelButtonProps?: ButtonProps
  okText?: string
  okButtonProps?: ButtonProps
  beforeClose?: (cb: () => void) => void
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onCancel?: () => void
  onOK?: () => void
  loadingText?: string
}

export interface FormDialogSlotContent {
  header(props: {
    resolve: (type?: string) => void
    reject: () => void
    form: Form
  }): any
  default(): any
  footer(props: {
    resolve: (type?: string) => void
    reject: () => void
    form: Form
  }): any
}

export interface IFormDialog {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forConfirm: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forExtra: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forExtra1: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forExtra2: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forExtra3: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forCancel: (middleware: IMiddleware<IFormProps>) => IFormDialog
  open: (props?: IFormProps) => Promise<any>
  close: () => void
}
