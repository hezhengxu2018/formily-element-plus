import type { VueComponent } from '@formily/vue'
import type { Component } from 'vue'
import { isVoidField } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import { each } from '@formily/shared'
import { useField } from '@formily/vue'
import { defineComponent, h } from 'vue'

type ListenersTransformRules = Record<string, string>

export function transformComponent<T extends Record<string, any>>(tag: any, transformRules?: ListenersTransformRules): Component<T> | any {
  return defineComponent({
    setup(props, { attrs, slots }) {
      return () => {
        const data = {
          ...attrs,
        }
        if (transformRules) {
          const listeners = transformRules
          each(listeners, (event, extract) => {
            data[`on${event[0].toUpperCase()}${event.slice(1)}`]
              = attrs[`on${extract[0].toUpperCase()}${extract.slice(1)}`]
          })
        }
        return h(tag, data, slots)
      }
    },
  })
}

// fork from https://github.com/alibaba/formily/blob/7c64c671252adf85471ac5aabfddbaf4fc537354/packages/vue/src/shared/connect.ts#L65
export function mapReadPretty<T extends VueComponent, C extends VueComponent>(
  component: C,
  readPrettyProps?: Record<string, any>,
) {
  return (target: T) => {
    return observer(
      defineComponent({
        name: target.name ? `Read${target.name}` : `ReadComponent`,
        setup(props, { attrs, slots, listeners }: Record<string, any>) {
          const fieldRef = useField()
          return () => {
            const field = fieldRef.value
            const isEditableReadPretty = !!field?.data?.readPretty
            return h(
              field && !isVoidField(field) && (field.pattern === 'readPretty' || isEditableReadPretty)
                ? component
                : target,
              {
                attrs: {
                  ...readPrettyProps,
                  ...attrs,
                },
                on: listeners,
              },
              slots,
            )
          }
        },
      }),
    )
  }
}
