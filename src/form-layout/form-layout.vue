<script lang="ts" setup>
import type { FormContext } from 'element-plus'
import type { IFormLayoutProps } from './types'
import { isEmpty } from '@formily/shared'
import { useThrottleFn } from '@vueuse/core'
import { formContextKey } from 'element-plus'
import { provide, ref, watch } from 'vue'
import { stylePrefix } from '../__builtins__'
import { formLayoutDeepContext, formLayoutShallowContext, useFormDeepLayout, useResponsiveFormLayout } from './utils'
import { isNil } from 'lodash-es'

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
  shallow: true,
  statusIcon: true,
})
const formPrefixCls = `${stylePrefix}-form`
const rootHTMLRef = ref<HTMLElement>()

// 1. 初始化布局配置
const formLayoutDeepConfig = useFormDeepLayout()
const { props: responsiveProps } = useResponsiveFormLayout(props, rootHTMLRef)

// 2. 统一管理深层布局配置
const deepLayout = ref({
  ...formLayoutDeepConfig.value,
  ...(!props.shallow ? props : {
    ...(!isNil(props.size) && { size: props.size }),
    ...(!isNil(props.colon) && { colon: props.colon })
  })
})
provide(formLayoutDeepContext, deepLayout)

// 3. 管理浅层布局配置
const shallowLayout = ref(props.shallow ? { ...props } : {})
provide(formLayoutShallowContext, shallowLayout)

const updateLayout = useThrottleFn(() => {
  if (!isEmpty(responsiveProps.value)) {
    shallowLayout.value = { ...props, ...responsiveProps.value }
  }
}, 200)

watch(() => [props, responsiveProps], updateLayout, {
  deep: true,
  immediate: true
})

provide(formContextKey, {
  statusIcon: props.statusIcon,
  hideRequiredAsterisk: props.hideRequiredAsterisk,
  requireAsteriskPosition: props.requireAsteriskPosition
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
