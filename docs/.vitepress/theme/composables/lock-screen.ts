import { isClient } from '@vueuse/core'
import { onUnmounted } from 'vue'
import {
  addClass,
  getScrollBarWidth,
  getStyle,
  hasClass,
  removeClass,
} from '../utils/style'

export function useLockScreen() {
  let scrollBarWidth = 0
  let withoutHiddenClass = false
  let bodyPaddingRight = '0'
  let computedBodyPaddingRight = 0

  const cleanup = () => {
    if (!isClient)
      return
    removeClass(document.body, 'el-popup-parent--hidden')
    if (withoutHiddenClass) {
      document.body.style.paddingRight = bodyPaddingRight
    }
  }

  const lock = () => {
    if (!isClient)
      return
    withoutHiddenClass = !hasClass(document.body, 'el-popup-parent--hidden')
    if (withoutHiddenClass) {
      bodyPaddingRight = document.body.style.paddingRight
      computedBodyPaddingRight = Number.parseInt(
        getStyle(document.body, 'paddingRight'),
        10,
      )
    }
    scrollBarWidth = getScrollBarWidth('el')
    const bodyHasOverflow
      = document.documentElement.clientHeight < document.body.scrollHeight
    const bodyOverflowY = getStyle(document.body, 'overflowY')
    if (
      scrollBarWidth > 0
      && (bodyHasOverflow || bodyOverflowY === 'scroll')
      && withoutHiddenClass
    ) {
      document.body.style.paddingRight = `${
        computedBodyPaddingRight + scrollBarWidth
      }px`
    }
    addClass(document.body, 'el-popup-parent--hidden')
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    lock,
    cleanup,
  }
}
