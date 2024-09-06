import { FormProvider, FragmentComponent } from '@formily/vue'
import { toJS } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import type { Form, IFormProps } from '@formily/core'
import { createForm } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import { applyMiddleware, isBool, isFn, isNum, isStr } from '@formily/shared'
import { ElButton, ElConfigProvider, ElDialog } from 'element-plus'
import type {
  ElButton as ElButtonProps,
  ElDialog as ElDialogProps,
} from 'element-plus'
import type { Component, PropType, VNode } from 'vue'
import { Teleport, createApp, defineComponent, h, onMounted, ref } from 'vue'
import {
  createPortalProvider,
  getPortalProvides,
  isValidElement,
  loadElConfigProvider,
  loading,
  resolveComponent,
  stylePrefix,
} from '../__builtins__'

interface FormDialogContentProps {
  form: Form
}

type FormDialogContent = Component | ((props: FormDialogContentProps) => VNode)

type DialogTitle = string | number | Component | VNode | (() => VNode)

type IFormDialogProps = Omit<typeof ElDialogProps, 'title'> & {
  title?: DialogTitle
  footer?: null | Component | VNode | (() => VNode)
  cancelText?: string | Component | VNode | (() => VNode)
  cancelButtonProps?: typeof ElButtonProps
  okText?: string | Component | VNode | (() => VNode)
  okButtonProps?: typeof ElButtonProps
  beforeClose?: (cb: () => void) => void
  onOpen?: () => void
  onOpend?: () => void
  onClose?: () => void
  onClosed?: () => void
  onCancel?: () => void
  onOK?: () => void
  loadingText?: string
}

const PORTAL_TARGET_NAME = 'FormDialogFooter'

function isDialogTitle(props: any): props is DialogTitle {
  return isNum(props) || isStr(props) || isBool(props) || isValidElement(props)
}

function getDialogProps(props: any): IFormDialogProps {
  if (isDialogTitle(props)) {
    return {
      title: props,
    } as IFormDialogProps
  }
  else {
    return props
  }
}

export interface IFormDialog {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forConfirm: (middleware: IMiddleware<IFormProps>) => IFormDialog
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
  content: FormDialogContent
): IFormDialog

export function FormDialog(
  title: IFormDialogProps | DialogTitle,
  id: string | symbol,
  content: FormDialogContent
): IFormDialog

export function FormDialog(
  title: DialogTitle,
  id: string,
  content: FormDialogContent
): IFormDialog

export function FormDialog(
  title: IFormDialogProps | DialogTitle,
  id: string | symbol | FormDialogContent,
  content?: FormDialogContent,
): IFormDialog {
  if (isFn(id) || isValidElement(id)) {
    content = id as FormDialogContent
    id = 'form-dialog'
  }
  const elConfig = loadElConfigProvider()

  const prefixCls = `${stylePrefix}-form-dialog`
  const env = {
    root: document.createElement('div'),
    form: null,
    promise: null,
    app: null,
    instance: null,
    openMiddlewares: [],
    confirmMiddlewares: [],
    cancelMiddlewares: [],
  }

  document.body.appendChild(env.root)

  const props = getDialogProps(title)
  const dialogProps = {
    ...props,
    onClosed: () => {
      props.onClosed?.()
      env.app?.unmount?.()
      env.app = null
      env.instance = null
      env.root?.parentNode?.removeChild(env.root)
      env.root = undefined
    },
  }

  const component = observer(
    defineComponent({
      setup() {
        return () =>
          h(
            FragmentComponent,
            {},
            {
              default: () =>
                resolveComponent(content, {
                  form: env.form,
                }),
            },
          )
      },
    }),
  )

  const render = (visible = true, resolve?: () => any, reject?: () => any) => {
    if (!env.instance) {
      const ComponentConstructor = observer(
        defineComponent({
          props: { dialogProps: Object as PropType<typeof ElDialogProps> },
          data() {
            return {
              visible: false,
            }
          },
          render() {
            const {
              onClose,
              onClosed,
              onOpen,
              onOpend,
              onOK,
              onCancel,
              title,
              footer,
              okText,
              cancelText,
              okButtonProps,
              cancelButtonProps,
              ...dialogProps
            } = this.dialogProps

            return h(
              ElDialog,
              {
                'class': [`${prefixCls}`],
                ...dialogProps,
                'modelValue': this.visible,
                'onUpdate:modelValue': (val) => {
                  this.visible = val
                },
                'onClose': () => {
                  onClose?.()
                },
                'onClosed': () => {
                  onClosed?.()
                },
                'onOpen': () => {
                  onOpen?.()
                },
                'onOpened': () => {
                  onOpend?.()
                },
                'beforeClose': (done) => {
                  reject()
                  done()
                },
              },
              {
                default: () =>
                  h(FormProvider, { form: env.form }, () =>
                    h(ElConfigProvider, elConfig, () => h(component))),
                header: () =>
                  h('div', {}, { default: () => resolveComponent(title) }),
                footer: () =>
                  h(
                    'div',
                    {},
                    {
                      default: () => {
                        const FooterPortalTarget = h(
                          'span',
                          {
                            id: PORTAL_TARGET_NAME,
                          },
                          {},
                        )
                        if (footer === null) {
                          return [null, FooterPortalTarget]
                        }
                        else if (footer) {
                          return [resolveComponent(footer), FooterPortalTarget]
                        }

                        return [
                          h(
                            ElButton,
                            {
                              ...cancelButtonProps,
                              onClick: (e) => {
                                onCancel?.(e)
                                reject()
                              },
                            },
                            {
                              default: () =>
                                resolveComponent(
                                  cancelText || '取消',
                                ),
                            },
                          ),
                          h(
                            ElButton,
                            {
                              type: 'primary',
                              ...okButtonProps,
                              loading: env.form.submitting,
                              onClick: (e) => {
                                onOK?.(e)
                                resolve()
                              },
                            },
                            {
                              default: () =>
                                resolveComponent(
                                  okText || '确定',
                                ),
                            },
                          ),
                          FooterPortalTarget,
                        ]
                      },
                    },
                  ),
              },
            )
          },
        }),
      )
      env.app = createApp(ComponentConstructor, {
        dialogProps,
      })

      const provides = getPortalProvides(id as string)
      for (const key in provides) {
        if (Object.prototype.hasOwnProperty.call(provides, key)) {
          const element = provides[key]
          env.app.provide(key, element)
        }
      }

      env.instance = env.app.mount(env.root)
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
    forCancel: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.cancelMiddlewares.push(middleware)
      }
      return formDialog
    },
    open: (props: IFormProps) => {
      if (env.promise)
        return env.promise

      env.promise = new Promise((resolve, reject) => {
        loading(dialogProps.loadingText, () =>
          applyMiddleware(props, env.openMiddlewares))
          .then((props) => {
            env.form = env.form || createForm(props)

            render(
              true,
              () => {
                env.form
                  .submit(async () => {
                    await applyMiddleware(env.form, env.confirmMiddlewares)
                    resolve(toJS(env.form.values))
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
                  })
                  .catch((e) => {
                    console.warn(e)
                  })
              },
              async () => {
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
                reject(new Error('cancel'))
              },
            )
          })
          .catch(e => reject(e))
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

const FormDialogFooter = defineComponent({
  name: 'FFormDialogFooter',
  setup(props, { slots }) {
    const teleportComponent = ref<VNode | null>(null)

    onMounted(() => {
      if (document.querySelector(`#${PORTAL_TARGET_NAME}`)) {
        teleportComponent.value = h(
          Teleport as any,
          {
            to: `#${PORTAL_TARGET_NAME}`,
          },
          slots,
        )
      }
    })

    return () => teleportComponent.value
  },
})

FormDialog.Footer = FormDialogFooter
FormDialog.Portal = createPortalProvider('form-dialog')

export default FormDialog
