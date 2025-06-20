import { isClient } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { throttleAndDebounce } from '../utils'

const threshold = 960

const cubic = (value: number): number => value ** 3
function easeInOutCubic(value: number): number {
  return value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2
}

function scrollToTop() {
  const beginTime = Date.now()
  const beginValue = document.documentElement.scrollTop
  const rAF = globalThis.requestAnimationFrame
  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / 500
    if (progress < 1) {
      document.documentElement.scrollTop
        = beginValue * (1 - easeInOutCubic(progress))
      rAF(frameFunc)
    }
    else {
      document.documentElement.scrollTop = 0
    }
  }
  rAF(frameFunc)
}

export function useBackTop(offset = 200) {
  const shouldShow = ref(false)
  const throttleResize = throttleAndDebounce(onResize, 300)
  const throttleScroll = throttleAndDebounce(onScroll, 160)

  onMounted(() => {
    if (!isClient)
      return
    onResize()
    onScroll()
    window.addEventListener('resize', throttleResize)
  })

  onBeforeUnmount(() => {
    if (!isClient)
      return
    window.removeEventListener('resize', throttleResize)
    window.removeEventListener('scroll', throttleScroll)
  })

  function onResize() {
    if (!isClient)
      return

    const { clientWidth } = document.body

    if (clientWidth < threshold) {
      window.addEventListener('scroll', throttleScroll)
    }
    else {
      window.removeEventListener('scroll', throttleScroll)
    }
  }

  function onScroll() {
    if (!isClient)
      return
    shouldShow.value = document.documentElement.scrollTop > offset
  }

  return {
    shouldShow,
    scrollToTop,
  }
}
