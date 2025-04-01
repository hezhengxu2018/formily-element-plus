import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { ButtonProps, DialogProps } from 'element-plus'
import type { App, Component, VNode } from 'vue'
import { createForm } from '@formily/core'
import { toJS } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { applyMiddleware, isFn, isNum, isStr } from '@formily/shared'
import { isNil } from 'lodash-es'
import { createApp } from 'vue'
import {
  loadElConfigProvider,
  loading,
  stylePrefix,
} from '../__builtins__'
import DialogContent from './dialog-content.vue'

interface FormDialogContentProps {
  form: Form
}

type FormDialogContent = Component | ((props: FormDialogContentProps) => VNode) | { header: () => VNode, footer: () => VNode, default: ((props: FormDialogContentProps) => VNode) }

type DialogTitle = string | number

type IFormDialogProps = DialogProps & {
  cancelText?: string
  cancelButtonProps?: ButtonProps
  okText?: string
  okButtonProps?: ButtonProps
  beforeClose?: (cb: () => void) => void
  onOpen?: () => void
  onOpend?: () => void
  onClose?: () => void
  onClosed?: () => void
  onCancel?: () => void
  onOK?: () => void
  loadingText?: string
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

export interface IFormDialogComponentProps {
  content: FormDialogContent
  resolve: () => any
  reject: () => any
}

export function FormDialog(
  title: IFormDialogProps | DialogTitle,
  content?: FormDialogContent,
): IFormDialog {
  const elConfig = loadElConfigProvider()
  const prefixCls = `${stylePrefix}-form-dialog`
  const env: {
    root?: HTMLElement
    form?: Form
    promise?: Promise<any>
    instance?: InstanceType<typeof DialogContent>
    app?: App<Element>
    openMiddlewares: IMiddleware<IFormProps>[]
    confirmMiddlewares: IMiddleware<Form>[]
    extraMiddlewares: IMiddleware<Form>[]
    extra1Middlewares: IMiddleware<Form>[]
    extra2Middlewares: IMiddleware<Form>[]
    extra3Middlewares: IMiddleware<Form>[]
    cancelMiddlewares: IMiddleware<Form>[]
  } = {
    root: document.createElement('div'),
    form: null,
    promise: null,
    app: null,
    instance: null,
    openMiddlewares: [],
    confirmMiddlewares: [],
    extraMiddlewares: [],
    extra1Middlewares: [],
    extra2Middlewares: [],
    extra3Middlewares: [],
    cancelMiddlewares: [],
  }

  document.body.append(env.root)

  const props = ((isNum(title) || isStr(title)) ? ({ title }) : title) as IFormDialogProps
  const dialogProps = {
    ...props,
    onClosed: () => {
      props.onClosed?.()
      env.app?.unmount?.()
      env.app = null
      env.instance = null
      env.root?.remove()
      env.root = undefined
    },
  }

  function render(visible = true, resolve?: (type?: string) => any, reject?: () => any) {
    if (!env.instance) {
      const ComponentConstructor = observer(DialogContent)
      env.app = createApp(ComponentConstructor, {
        dialogProps,
        prefixCls,
        elConfig,
        component: content,
        form: env.form,
        resolve,
        reject,
      })

      env.instance = env.app.mount(env.root) as InstanceType<typeof DialogContent>
    }
    env.instance.visible = visible
  }

  const formDialog = {
    forOpen: (middleware: IMiddleware<IFormProps>) => {
      if (isFn(middleware)) {
        env.openMiddlewares.push(middleware)
      }
      return formDialog
    },
    forConfirm: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.confirmMiddlewares.push(middleware)
      }
      return formDialog
    },
    forExtra: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.extraMiddlewares.push(middleware)
      }
      return formDialog
    },
    forExtra1: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.extra1Middlewares.push(middleware)
      }
      return formDialog
    },
    forExtra2: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.extra2Middlewares.push(middleware)
      }
      return formDialog
    },
    forExtra3: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.extra3Middlewares.push(middleware)
      }
      return formDialog
    },
    forCancel: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.cancelMiddlewares.push(middleware)
      }
      return formDialog
    },
    open: (props: IFormProps) => {
      if (env.promise)
        return env.promise

      env.promise = new Promise((res, rej) => {
        loading(dialogProps.loadingText, () => applyMiddleware(props, env.openMiddlewares))
          .then((props) => {
            env.form = env.form || createForm(props)
            render(true, (type: string) => {
              env.form.submit(async () => {
                await (isNil(type) ? applyMiddleware(env.form, env.confirmMiddlewares) : applyMiddleware(env.form, env[`${type}Middlewares`]))
                res(toJS(env.form.values))
                if (dialogProps.beforeClose) {
                  setTimeout(() => {
                    dialogProps.beforeClose(() => {
                      formDialog.close()
                    })
                  })
                }
                else {
                  formDialog.close()
                }
              }).catch((error) => {
                console.warn(error)
              })
            }, async () => {
              await loading(dialogProps.loadingText, () =>
                applyMiddleware(env.form, env.cancelMiddlewares))
              if (dialogProps.beforeClose) {
                dialogProps.beforeClose(() => {
                  formDialog.close()
                })
              }
              else {
                formDialog.close()
              }
              rej(new Error('cancel'))
            })
          })
          .catch(error => rej(error))
      })
      return env.promise
    },
    close: () => {
      if (!env.root)
        return
      render(false)
    },
  }
  return formDialog as never
}

export default FormDialog
