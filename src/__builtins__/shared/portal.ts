import type { AppContext } from 'vue'
import { defineComponent, getCurrentInstance, h, onBeforeUnmount } from 'vue'

export interface IPortalProps {
  id?: string | symbol
}

const PortalMap = new Map<string | symbol, any>()

export function createPortalProvider(id: string | symbol) {
  const Portal = defineComponent({
    name: 'PortalProvider',
    props: {
      id: {
        type: [String, Symbol],
        default: id,
      },
    },
    setup(props, { slots }) {
      onBeforeUnmount(() => {
        if (props.id && PortalMap.has(props.id)) {
          PortalMap.delete(id)
        }
      })

      // !HACK 不存在在官方类型声明中的属性值，可能有移除的风险
      const { provides } = getCurrentInstance() as unknown as AppContext
      if (props.id && !PortalMap.has(id)) {
        PortalMap.set(props.id, provides)
      }
      return () => h('div', slots.default())
    },
  })

  return Portal
}

export function getPortalProvides(id: string | symbol) {
  return PortalMap.get(id)
}
