<script lang="ts" setup>
import type { FormContext } from 'element-plus'
import type { IFormLayoutProps } from './types'
import { isEmpty, isValid } from '@formily/shared'
import { useForm } from '@formily/vue'
import { formContextKey } from 'element-plus'
import { provide, ref, watch } from 'vue'
import { stylePrefix, useCleanAttrs, useThrottleFn } from '../__builtins__'
import { filterValidFormLayoutProps, formLayoutDeepContext, formLayoutShallowContext, useFormDeepLayout, useResponsiveFormLayout } from './utils'

defineOptions({
  name: 'FFormLayout',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IFormLayoutProps>(), {
  tag: 'form',
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
const { props: attrs } = useCleanAttrs()
const rootHTMLRef = ref<HTMLElement>()

const formLayoutDeepConfig = useFormDeepLayout()
const { props: responsiveProps } = useResponsiveFormLayout(props, rootHTMLRef)

const deepLayout = ref({
  ...formLayoutDeepConfig.value,
  ...(props.shallow
    ? {
        ...(isValid(props.size) && { size: props.size }),
        ...(isValid(props.colon) && { colon: props.colon }),
      }
    : filterValidFormLayoutProps(props)),
})
provide(formLayoutDeepContext, deepLayout)

const shallowLayout = ref(props.shallow ? filterValidFormLayoutProps(props) : {})
provide(formLayoutShallowContext, shallowLayout)

const updateLayout = useThrottleFn(() => {
  if (!isEmpty(responsiveProps.value)) {
    const _responsiveProps = filterValidFormLayoutProps(responsiveProps.value)
    shallowLayout.value = filterValidFormLayoutProps({ ...props, ..._responsiveProps })
  }
}, 200, true)

watch(() => [props, responsiveProps], updateLayout, {
  deep: true,
  immediate: true,
})

provide(formContextKey, {
  statusIcon: props.statusIcon,
  hideRequiredAsterisk: props.hideRequiredAsterisk,
  requireAsteriskPosition: props.requireAsteriskPosition,
} as FormContext)

const formRef = useForm()
</script>

<template>
  <component
    :is="props.tag"
    :id="formRef?.id && `formily-${formRef?.id}`"
    ref="rootHTMLRef"
    :class="formPrefixCls"
    v-bind="attrs"
    @submit.prevent.stop
  >
    <slot />
  </component>
</template>
