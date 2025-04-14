import type { InjectionKey, Ref } from 'vue'
import type { IFormLayoutProps } from './types'
import { isArr, isValid } from '@formily/shared'
import { useResizeObserver } from '@vueuse/core'
import { inject, ref, watch } from 'vue'

function calcBreakpointIndex(breakpoints: number[], width: number): number {
  for (const [i, breakpoint] of breakpoints.entries()) {
    if (width <= breakpoint) {
      return i
    }
  }
  return -1
}

function calcFactor<T>(value: T | readonly T[], breakpointIndex: number): T {
  if (!Array.isArray(value) || value.length === 0) {
    return value as T
  }
  const safeIndex = Math.max(0, Math.min(breakpointIndex, value.length - 1))
  return value[safeIndex]
}

function factor<T>(value: T | T[], breakpointIndex: number): T {
  return isValid(value) ? calcFactor<T>(value, breakpointIndex) : value as T
}

function calculateProps(target: Element, props: IFormLayoutProps): IFormLayoutProps {
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

export function useResponsiveFormLayout(props: IFormLayoutProps, root: Ref<HTMLElement | null>) {
  const { breakpoints } = props
  if (!isArr(breakpoints)) {
    return {
      props: ref(props),
    }
  }

  const layoutProps = ref<IFormLayoutProps>({})

  useResizeObserver(root, () => {
    layoutProps.value = calculateProps(root.value, props)
  })

  return {
    props: layoutProps,
  }
}

export const formLayoutDeepContext: InjectionKey<Ref<IFormLayoutProps>> = Symbol(
  'formLayoutDeepContext',
)

export const formLayoutShallowContext: InjectionKey<Ref<IFormLayoutProps>>
  = Symbol('formLayoutShallowContext')

export function useFormDeepLayout(): Ref<IFormLayoutProps> {
  return inject(formLayoutDeepContext)
}

export function useFormShallowLayout(): Ref<IFormLayoutProps> {
  return inject(formLayoutShallowContext, ref({}))
}

export function useFormLayout(): Ref<IFormLayoutProps> {
  const shallowLayout = inject(formLayoutShallowContext, ref({}))
  const deepLayout = inject(formLayoutDeepContext, ref({}))
  const formLayout = ref({
    ...deepLayout.value,
    ...shallowLayout.value,
  })

  watch(
    [shallowLayout, deepLayout],
    () => {
      formLayout.value = {
        ...deepLayout.value,
        ...shallowLayout.value,
      }
    },
    {
      deep: true,
    },
  )
  return formLayout
}

export const FORM_LAYOUT_PROPS_KEYS: ReadonlyArray<keyof IFormLayoutProps> = [
  'colon',
  'labelAlign',
  'wrapperAlign',
  'labelWrap',
  'labelWidth',
  'wrapperWidth',
  'wrapperWrap',
  'labelCol',
  'wrapperCol',
  'fullness',
  'size',
  'layout',
  'feedbackLayout',
  'tooltipLayout',
  'breakpoints',
  'spaceGap',
  'gridColumnGap',
  'gridRowGap',
] as const
