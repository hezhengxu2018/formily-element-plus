import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { ButtonProps, DrawerProps } from 'element-plus'
import type { SlotsType, VNode } from 'vue'

export type IFormDrawerProps = Partial<DrawerProps> & {
  cancelText?: string
  cancelButtonProps?: ButtonProps
  okText?: string
  okButtonProps?: ButtonProps
  loadingText?: string
}

export interface FormDrawerSlotProps {
  resolve: (type?: string) => void
  reject: () => void
  form: Form
}

export interface FormDrawerSlots {
  header?: (props: FormDrawerSlotProps) => VNode
  default?: () => VNode
  footer?: (props: FormDrawerSlotProps) => VNode
}

export type FormDrawerSlotContent = SlotsType<FormDrawerSlots> | {
  [key in keyof FormDrawerSlots]?: FormDrawerSlots[key]
}

export interface IFormDrawer {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  forConfirm: (middleware: IMiddleware<Form>) => IFormDrawer
  forCancel: (middleware: IMiddleware<Form>) => IFormDrawer
  [key: `for${string}`]: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  open: (props?: IFormProps) => Promise<any>
  close: () => void
}
