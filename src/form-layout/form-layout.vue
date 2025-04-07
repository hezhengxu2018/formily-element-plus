<script lang="ts" setup>
import type { Ref } from 'vue'
import type { IFormLayoutProps } from './types'
import { provide, ref, watch } from 'vue'
import { stylePrefix } from '../__builtins__'
import { formLayoutDeepContext, formLayoutShallowContext, useFormDeepLayout, useResponsiveFormLayout } from './useResponsiveFormLayout'
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

const deepLayout = useFormDeepLayout()
const newDeepLayout: Ref<IFormLayoutProps> = ref({ ...deepLayout.value })
const shallowProps: Ref<IFormLayoutProps | undefined> = ref({})

watch(
  [responsiveProps, deepLayout],
  () => {
    shallowProps.value = responsiveProps.value.shallow ? responsiveProps.value : undefined
    if (responsiveProps.value.shallow) {
      newDeepLayout.value.size = responsiveProps.value.size
      newDeepLayout.value.colon = responsiveProps.value.colon
    }
    else {
      Object.assign(newDeepLayout.value, responsiveProps.value)
    }
  },
  { deep: true, immediate: true },
)

provide(formLayoutDeepContext, newDeepLayout)
provide(formLayoutShallowContext, shallowProps)
</script>

<template>
  <div
    ref="rootHTMLRef"
    :class="formPrefixCls"
  >
    <slot />
  </div>
</template>
