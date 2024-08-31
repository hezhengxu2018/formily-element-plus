import { defineComponent, onBeforeUnmount } from 'vue'
import { Fragment, h } from '@formily/vue'

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

    setup(props) {
      onBeforeUnmount(() => {
        const { id } = props
        if (id && PortalMap.has(id)) {
          PortalMap.delete(id)
        }
      })
    },

    render() {
      const { id } = this
      if (id && !PortalMap.has(id)) {
        PortalMap.set(id, this)
      }

      return h(Fragment, {}, this.$slots)
    },
  })

  return Portal
}

export function getPortalContext(id: string | symbol) {
  return PortalMap.get(id)
}
