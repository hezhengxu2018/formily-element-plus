import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type {
  ElButton as ElButtonProps,
  ElDrawer as ElDrawerProps,
} from 'element-plus'
import type { Component, PropType, VNode } from 'vue'
import { createForm } from '@formily/core'
import { toJS } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { applyMiddleware, isBool, isFn, isNum, isStr } from '@formily/shared'
import { FormProvider, FragmentComponent } from '@formily/vue'
import { ElButton, ElConfigProvider, ElDrawer } from 'element-plus'
import { createApp, defineComponent, h, onMounted, ref, Teleport } from 'vue'
import {
  createPortalProvider,
  getPortalProvides,
  isValidElement,
  loadElConfigProvider,
  loading,
  resolveComponent,
  stylePrefix,
} from '../__builtins__'

interface FormDrawerContentProps { form: Form }

type FormDrawerContent = Component | ((props: FormDrawerContentProps) => VNode)

type DrawerTitle = string | number | Component | VNode | (() => VNode)

type IFormDrawerProps = Omit<typeof ElDrawerProps, 'title'> & {
  title?: DrawerTitle
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

const PORTAL_TARGET_NAME = 'FormDrawerFooter'

function isDrawerTitle(props: any): props is DrawerTitle {
  return isNum(props) || isStr(props) || isBool(props) || isValidElement(props)
}

function getDrawerProps(props: any): IFormDrawerProps {
  return isDrawerTitle(props)
    ? {
        title: props,
      } as IFormDrawerProps
    : props
}

export interface IFormDrawer {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  forConfirm: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  forCancel: (middleware: IMiddleware<IFormProps>) => IFormDrawer
  open: (props?: IFormProps) => Promise<any>
  close: () => void
}

export interface IFormDrawerComponentProps {
  content: FormDrawerContent
  resolve: () => any
  reject: () => any
}

export function FormDrawer(
  title: IFormDrawerProps | DrawerTitle,
  content: FormDrawerContent
): IFormDrawer

export function FormDrawer(
  title: IFormDrawerProps | DrawerTitle,
  id: string | symbol,
  content: FormDrawerContent
): IFormDrawer

export function FormDrawer(
  title: DrawerTitle,
  id: string,
  content: FormDrawerContent
): IFormDrawer

export function FormDrawer(
  title: IFormDrawerProps | DrawerTitle,
  id: string | symbol | FormDrawerContent,
  content?: FormDrawerContent,
): {
    forOpen: (middleware: IMiddleware<IFormProps>) => {
      forOpen: (middleware: IMiddleware<IFormProps>) => any
      forConfirm: (middleware: IMiddleware<Form>) => any
      close: () => void
      open: (props: IFormProps) => never
      forCancel: (middleware: IMiddleware<Form>) => any
    }
    forConfirm: (middleware: IMiddleware<Form>) => {
      forOpen: (middleware: IMiddleware<IFormProps>) => any
      forConfirm: (middleware: IMiddleware<Form>) => any
      close: () => void
      open: (props: IFormProps) => never
      forCancel: (middleware: IMiddleware<Form>) => any
    }
    close: () => void
    open: (props: IFormProps) => never
    forCancel: (middleware: IMiddleware<Form>) => {
      forOpen: (middleware: IMiddleware<IFormProps>) => any
      forConfirm: (middleware: IMiddleware<Form>) => any
      close: () => void
      open: (props: IFormProps) => never
      forCancel: (middleware: IMiddleware<Form>) => any
    }
  } {
  if (isFn(id) || isValidElement(id)) {
    content = id as FormDrawerContent
    id = 'form-drawer'
  }
  const elConfig = loadElConfigProvider()

  const prefixCls = `${stylePrefix}-form-drawer`
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

  document.body.append(env.root)

  const props = getDrawerProps(title)
  const drawerProps = {
    ...props,
    onClosed: () => {
      props.onClosed?.()
      env.app.unmount()
      env.app = null
      env.instance = null
      env.root?.remove()
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
              default: () => [
                resolveComponent(content, {
                  form: env.form,
                }),
              ],
            },
          )
      },
    }),
  )

  const render = (visible = true, resolve?: () => any, reject?: () => any) => {
    if (!env.instance) {
      const ComponentConstructor = observer(
        defineComponent({
          props: { drawerProps: { type: Object as PropType<IFormDrawerProps> } },
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
              ...drawerProps
            } = this.drawerProps

            return h(
              ElDrawer,
              {
                'class': `${prefixCls}`,
                'zIndex': elConfig.zIndex,
                ...drawerProps,
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
                  h('div', {}, { default: () => [resolveComponent(title)] }),
                footer: () =>
                  h(
                    'div',
                    {
                      class: `${prefixCls}-footer`,
                    },
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
                              onClick: (e: MouseEvent) => {
                                onCancel?.(e)
                                reject()
                              },
                            },
                            {
                              default: () => [
                                resolveComponent(
                                  cancelText || '取消',
                                ),
                              ],
                            },
                          ),
                          h(
                            ElButton,
                            {
                              type: 'primary',
                              ...okButtonProps,
                              loading: env.form.submitting,
                              onClick: (e: MouseEvent) => {
                                onOK?.(e)
                                resolve()
                              },
                            },
                            {
                              default: () => [
                                resolveComponent(
                                  okText || '确定',
                                ),
                              ],
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
        drawerProps,
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

  const formDrawer = {
    forOpen: (middleware: IMiddleware<IFormProps>) => {
      if (isFn(middleware)) {
        env.openMiddlewares.push(middleware)
      }
      return formDrawer
    },
    forConfirm: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.confirmMiddlewares.push(middleware)
      }
      return formDrawer
    },
    forCancel: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.cancelMiddlewares.push(middleware)
      }
      return formDrawer
    },
    open: (props: IFormProps) => {
      if (env.promise)
        return env.promise

      env.promise = new Promise((resolve, reject) => {
        loading(drawerProps.loadingText, () =>
          applyMiddleware(props, env.openMiddlewares)).then((props) => {
          env.form = env.form || createForm(props)
          render(
            true,
            () => {
              env.form
                .submit(async () => {
                  await applyMiddleware(env.form, env.confirmMiddlewares)
                  resolve(toJS(env.form.values))
                  if (drawerProps.beforeClose) {
                    setTimeout(() => {
                      drawerProps.beforeClose(() => {
                        formDrawer.close()
                      })
                    })
                  }
                  else {
                    formDrawer.close()
                  }
                })
                .catch((error) => {
                  console.warn(error)
                })
            },
            async () => {
              await loading(drawerProps.loadingText, () =>
                applyMiddleware(env.form, env.cancelMiddlewares))

              if (drawerProps.beforeClose) {
                drawerProps.beforeClose(() => {
                  formDrawer.close()
                })
              }
              else {
                formDrawer.close()
              }
              reject(new Error('cancel'))
            },
          )
        }).catch(error => reject(error))
      })
      return env.promise
    },
    close: () => {
      if (!env.root)
        return
      render(false)
    },
  }

  return formDrawer as never
}

const FormDrawerFooter = defineComponent({
  name: 'FFormDrawerFooter',
  setup(props, { slots }) {
    const teleportComponent = ref<VNode | null>(null)

    onMounted(() => {
      if (document.querySelector(`#${PORTAL_TARGET_NAME}`)) {
        teleportComponent.value = h(
          Teleport,
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

FormDrawer.Footer = FormDrawerFooter
FormDrawer.Portal = createPortalProvider('form-drawer')

export default FormDrawer
