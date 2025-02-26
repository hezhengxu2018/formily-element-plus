import type { CSSProperties } from 'vue'
import { isClient } from '@vueuse/core'
import { camelize } from 'vue'

export function classNameToArray(cls = '') {
  return cls.split(' ').filter(item => !!item.trim())
}

export function hasClass(el: Element, cls: string): boolean {
  if (!el || !cls)
    return false
  if (cls.includes(' '))
    throw new Error('className should not contain space.')
  return el.classList.contains(cls)
}

export function addClass(el: Element, cls: string) {
  if (!el || !cls.trim())
    return
  el.classList.add(...classNameToArray(cls))
}

export function removeClass(el: Element, cls: string) {
  if (!el || !cls.trim())
    return
  el.classList.remove(...classNameToArray(cls))
}

export function getStyle(element: HTMLElement, styleName: keyof CSSProperties): string {
  if (!isClient || !element || !styleName)
    return ''

  let key = camelize(styleName)
  if (key === 'float')
    key = 'cssFloat'
  try {
    const style = (element.style as any)[key]
    if (style)
      return style
    const computed: any = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[key] : ''
  }
  catch {
    return (element.style as any)[key]
  }
}

let scrollBarWidth: number
export function getScrollBarWidth(namespace: string): number {
  if (!isClient)
    return 0
  if (scrollBarWidth !== undefined)
    return scrollBarWidth

  const outer = document.createElement('div')
  outer.className = `${namespace}-scrollbar__wrap`
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.append(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.append(inner)

  const widthWithScroll = inner.offsetWidth
  outer.remove()
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}
