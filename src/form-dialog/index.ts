import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { App } from 'vue'
import type { FormDialogContent, IFormDialog, IFormDialogProps } from './types'
import { createForm } from '@formily/core'
import { toJS } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { applyMiddleware, isFn, isNum, isStr } from '@formily/shared'
import { isNil } from 'lodash-es'
import { createApp } from 'vue'
import {
  loading,
} from '../__builtins__'
import DialogContent from './dialog-content.vue'

export function FormDialog(
  title: IFormDialogProps | string,
  content?: FormDialogContent,
): IFormDialog {
  const env: {
    root?: HTMLElement
    form?: Form
    promise?: Promise<any>
    instance?: InstanceType<typeof DialogContent>
    app?: App<Element>
    openMiddlewares: IMiddleware<IFormProps>[]
    confirmMiddlewares: IMiddleware<Form>[]
    extraMiddlewares: IMiddleware<Form>[]
    // extra1Middlewares: IMiddleware<Form>[]
    // extra2Middlewares: IMiddleware<Form>[]
    // extra3Middlewares: IMiddleware<Form>[]
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
    // extra1Middlewares: [],
    // extra2Middlewares: [],
    // extra3Middlewares: [],
    cancelMiddlewares: [],
  }

  document.body.append(env.root)

  const props = (isStr(title) ? ({ title }) : title) as IFormDialogProps
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

  function render(visible: boolean, resolve?: (type?: string) => any, reject?: () => any) {
    if (!env.instance) {
      const ComponentConstructor = observer(DialogContent)
      env.app = createApp(ComponentConstructor, {
        dialogProps,
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
      isFn(middleware) && env.openMiddlewares.push(middleware)
      return formDialog
    },
    forConfirm: (middleware: IMiddleware<Form>) => {
      isFn(middleware) && env.confirmMiddlewares.push(middleware)
      return formDialog
    },
    forExtra: (middleware: IMiddleware<Form>) => {
      isFn(middleware) && env.extraMiddlewares.push(middleware)
      return formDialog
    },
    // forExtra1: (middleware: IMiddleware<Form>) => {
    //   if (isFn(middleware)) {
    //     env.extra1Middlewares.push(middleware)
    //   }
    //   return formDialog
    // },
    // forExtra2: (middleware: IMiddleware<Form>) => {
    //   if (isFn(middleware)) {
    //     env.extra2Middlewares.push(middleware)
    //   }
    //   return formDialog
    // },
    // forExtra3: (middleware: IMiddleware<Form>) => {
    //   if (isFn(middleware)) {
    //     env.extra3Middlewares.push(middleware)
    //   }
    //   return formDialog
    // },
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
  return formDialog as never
}

export default FormDialog
