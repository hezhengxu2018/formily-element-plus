import type { Component } from 'vue'
import { each } from '@formily/shared'
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
