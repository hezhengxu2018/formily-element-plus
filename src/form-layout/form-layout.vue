<script lang="ts" setup>
import type { FormContext } from 'element-plus'
import type { Ref } from 'vue'
import type { IFormLayoutProps } from './types'
import { useThrottleFn } from '@vueuse/core'
import { formContextKey } from 'element-plus'
import { provide, ref, watch } from 'vue'
import { stylePrefix } from '../__builtins__'
import { formLayoutDeepContext, formLayoutShallowContext, useResponsiveFormLayout } from './utils'
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
  shallow: false,
  statusIcon: true,
})
const formPrefixCls = `${stylePrefix}-form`
const rootHTMLRef = ref<HTMLElement>()

const formLayoutDeepConfig = ref()
provide(formLayoutDeepContext, formLayoutDeepConfig)
const { props: responsiveProps } = useResponsiveFormLayout(props, rootHTMLRef)

const setFormLayoutThrottled = useThrottleFn(() => {
  formLayoutDeepConfig.value = { ...props, ...responsiveProps.value }
}, 200)

watch(() => [props, responsiveProps], setFormLayoutThrottled, {
  deep: true,
})

const shallowProps: Ref<IFormLayoutProps | undefined> = ref({})
provide(formLayoutShallowContext, shallowProps)
provide(formContextKey, {
  statusIcon: props.statusIcon,
  hideRequiredAsterisk: props.hideRequiredAsterisk,
} as FormContext)
</script>

<template>
  <div
    ref="rootHTMLRef"
    :class="[formPrefixCls]"
  >
    <slot />
  </div>
</template>
