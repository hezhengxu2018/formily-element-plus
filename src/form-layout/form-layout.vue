<script lang="ts" setup>
import type { Ref } from 'vue'
import type { IFormLayoutProps } from './types'
import { inject, provide, ref, watch } from 'vue'
import { formContextKey } from "element-plus";
import { stylePrefix } from '../__builtins__'
import { formLayoutDeepContext, formLayoutShallowContext, useFormDeepLayout, useResponsiveFormLayout } from './utils'
import './style.scss'

defineOptions({
  name: 'FFormLayout',
})

const props = withDefaults(defineProps<IFormLayoutProps>(), {
  colon: true,
  labelWrap: true,
  wrapperWrap: false,
  fullness: false,
  size: 'default',
  layout: 'horizontal',
  direction: 'ltr',
  shallow: true,
})
const formPrefixCls = `${stylePrefix}-form`
const rootHTMLRef = ref<HTMLElement>()

const { props: responsiveProps } = useResponsiveFormLayout(props, rootHTMLRef)

provide(formLayoutDeepContext, responsiveProps.value)
// const deepLayout = useFormDeepLayout()
// const newDeepLayout: Ref<IFormLayoutProps> = ref({ ...deepLayout.value })
const shallowProps: Ref<IFormLayoutProps | undefined> = ref({})

// watch(
//   [responsiveProps, deepLayout],
//   () => {
//     deepLayout.value = Object.assign(newDeepLayout.value, responsiveProps.value)
//   },
//   { deep: true, immediate: true },
// )

// provide(formLayoutDeepContext, newDeepLayout)
provide(formLayoutShallowContext, shallowProps)
provide(formContextKey, {
  statusIcon: true
})
</script>

<template>
  <div
    ref="rootHTMLRef"
    :class="[formPrefixCls]"
  >
    <slot />
  </div>
</template>
