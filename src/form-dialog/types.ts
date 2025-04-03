import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { ButtonProps, DialogProps } from 'element-plus'

export type IFormDialogProps = Partial<DialogProps> & {
  cancelText?: string
  cancelButtonProps?: ButtonProps
  okText?: string
  okButtonProps?: ButtonProps
  loadingText?: string
}

export interface FormDialogSlotContent {
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

export interface IFormDialog {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forConfirm: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forCancel: (middleware: IMiddleware<IFormProps>) => IFormDialog
  [key: `for${string}`]: (middleware: IMiddleware<IFormProps>) => IFormDialog
  open: (props?: IFormProps) => Promise<any>
  close: () => void
}
