import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { App, Component } from 'vue'
import type { FormDialogSlotContent, IFormDialog, IFormDialogProps } from './types'
import { createForm } from '@formily/core'
import { toJS } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { applyMiddleware, isArr, isFn, isStr } from '@formily/shared'
import { camelCase, capitalize, isNil } from 'lodash-es'
import { createApp, h, ref } from 'vue'
import { isVueOptions, loading } from '../__builtins__'
import DialogContent from './dialog-content.vue'

export function FormDialog(
  title: IFormDialogProps | string,
  content?: Component | FormDialogSlotContent,
  dynamicMiddlewareNames?: string[],
): IFormDialog {
  const env: {
    root?: HTMLElement
    form?: Form
    promise?: Promise<any>
    instance?: any
    app?: App<Element>
    openMiddlewares: IMiddleware<IFormProps>[]
    confirmMiddlewares: IMiddleware<Form>[]
    cancelMiddlewares: IMiddleware<Form>[]
    [key: `${string}Middlewares`]: IMiddleware<Form>[] | IMiddleware<IFormProps>[] | undefined
  } = {
    root: document.createElement('div'),
    form: null,
    promise: null,
    app: null,
    instance: null,
    openMiddlewares: [],
    confirmMiddlewares: [],
    cancelMiddlewares: [],
  }

  if (isArr(dynamicMiddlewareNames)) {
    for (const middlewareName of dynamicMiddlewareNames) {
      /* istanbul ignore if -- @preserve */
      if (!isStr(middlewareName))
        return
      const _middlewareName = camelCase(middlewareName)
      /* istanbul ignore if -- @preserve */
      if (['open', 'cancel', 'confirm'].includes(_middlewareName)) {
        throw new Error(`for${capitalize(_middlewareName)} is presved`)
      }
      (env[`${_middlewareName}Middlewares`] = [])
    }
  }

  document.body.append(env.root)

  const props = (isStr(title) ? ({ title }) : title) as IFormDialogProps
  const dialogProps = {
    ...props,
    onClosed: () => {
      env.app?.unmount?.()
      env.app = null
      env.instance = null
      env.root?.remove()
      env.root = undefined
    },
  }

  function render(visible: boolean, resolve?: (type?: string) => any, reject?: () => any) {
    const _content = isVueOptions(content)
      ? { default: () => h(content) }
      : content
    if (!env.instance) {
      const ComponentConstructor = observer({
        setup(_, { expose }) {
          const visible = ref(false)
          expose({
            visible,
          })
          return () => h(DialogContent, {
            dialogProps,
            form: env.form,
            resolve,
            reject,
            visible: visible.value,
          }, _content)
        },
      })
      env.app = createApp(ComponentConstructor)
      env.instance = env.app.mount(env.root)
    }
    env.instance.visible = visible
  }

  const formDialog = {
    forOpen: (middleware: IMiddleware<IFormProps>) => {
      isFn(middleware) && env.openMiddlewares.push(middleware)
      return formDialog
    },
    forConfirm: (middleware: IMiddleware<Form>) => {
      isFn(middleware) && env.confirmMiddlewares.push(middleware)
      return formDialog
    },
    forCancel: (middleware: IMiddleware<Form>) => {
      isFn(middleware) && env.cancelMiddlewares.push(middleware)
      return formDialog
    },
    open: (props: IFormProps) => {
      /* istanbul ignore if -- @preserve */
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
                formDialog.close()
              }).catch((error) => {
                console.warn(error)
              })
            }, async () => {
              await loading(dialogProps.loadingText, () =>
                applyMiddleware(env.form, env.cancelMiddlewares))
              formDialog.close()
              rej(new Error('cancel'))
            })
          })
          .catch(/* istanbul ignore next -- @preserve */ error => rej(error))
      })
      return env.promise
    },
    close: () => {
      /* istanbul ignore if -- @preserve */
      if (!env.root)
        return
      render(false)
    },
  }
  if (isArr(dynamicMiddlewareNames)) {
    for (const middlewareName of dynamicMiddlewareNames) {
      const _middlewareName = camelCase(middlewareName)
      formDialog[`for${capitalize(_middlewareName)}`] = (middleware: IMiddleware<Form>) => {
        isFn(middleware) && env[`${_middlewareName}Middlewares`].push(middleware)
        return formDialog
      }
    }
  }

  return formDialog as never
}

export default FormDialog
