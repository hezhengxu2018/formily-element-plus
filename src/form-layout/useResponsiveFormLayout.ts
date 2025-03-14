import type { ComponentInternalInstance } from 'vue'
import { isArr, isValid } from '@formily/shared'
import { getCurrentInstance, onMounted, ref } from 'vue'

interface IProps {
  breakpoints?: number[]
  layout?:
    | 'vertical'
    | 'horizontal'
    | 'inline'
    | ('vertical' | 'horizontal' | 'inline')[]
  labelCol?: number | number[]
  wrapperCol?: number | number[]
  labelAlign?: 'right' | 'left' | ('right' | 'left')[]
  wrapperAlign?: 'right' | 'left' | ('right' | 'left')[]
  [props: string]: any
}

interface ICalcBreakpointIndex {
  (originalBreakpoints: number[], width: number): number
}

interface ICalculateProps {
  (target: Element, props: IProps): IProps
}

const calcBreakpointIndex: ICalcBreakpointIndex = (breakpoints, width) => {
  for (const [i, breakpoint] of breakpoints.entries()) {
    if (width <= breakpoint) {
      return i
    }
  }
  return -1
}

function calcFactor<T>(value: T | T[], breakpointIndex: number): T {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1)
      return value[0]
    return value[breakpointIndex] ?? value.at(-1)
  }
  else {
    return value
  }
}

function factor<T>(value: T | T[], breakpointIndex: number): T {
  return isValid(value) ? calcFactor(value as any, breakpointIndex) : value
}

const calculateProps: ICalculateProps = (target, props) => {
  const { clientWidth } = target
  const {
    breakpoints,
    layout,
    labelAlign,
    wrapperAlign,
    labelCol,
    wrapperCol,
    ...otherProps
  } = props
  const breakpointIndex = calcBreakpointIndex(
    breakpoints as number[],
    clientWidth,
  )

  return {
    layout: factor(layout, breakpointIndex),
    labelAlign: factor(labelAlign, breakpointIndex),
    wrapperAlign: factor(wrapperAlign, breakpointIndex),
    labelCol: factor(labelCol, breakpointIndex),
    wrapperCol: factor(wrapperCol, breakpointIndex),
    ...otherProps,
  }
}

function useRefs(): Record<string, unknown> {
  const vm: ComponentInternalInstance | null = getCurrentInstance()
  return vm?.refs || {}
}

export function useResponsiveFormLayout(props: any) {
  const { breakpoints } = props
  if (!isArr(breakpoints)) {
    return {
      props: ref(props),
    }
  }
  const layoutProps = ref<IProps>({})

  const updateUI = (target: HTMLElement) => {
    layoutProps.value = calculateProps(target, props)
  }

  onMounted(() => {
    const { root } = useRefs()
    const observer = () => {
      updateUI(root as HTMLElement)
    }
    const resizeObserver = new ResizeObserver(observer)
    if (root) {
      resizeObserver.observe(root as Element)
    }

    updateUI(root as HTMLElement)

    return () => {
      resizeObserver.disconnect()
    }
  })

  return {
    props: layoutProps,
  }
}
