<script lang="ts" setup>
import type {
  FormContext,
  FormItemContext,
  FormItemValidateState,
  FormValidationResult,
} from 'element-plus'
import type { IFormLayoutProps } from 'src/form-layout/types'
import type { CSSProperties, Ref } from 'vue'
import type { IFormItemProps } from './types'
import { InfoFilled } from '@element-plus/icons-vue'
import { isArr } from '@formily/shared'
import { useField } from '@formily/vue'
import { refDebounced } from '@vueuse/core'
import { ElIcon, ElTooltip, formContextKey, formItemContextKey, useFormSize, useId, useNamespace } from 'element-plus'
import {
  addUnit,
  isBoolean,
} from 'element-plus/es/utils/index'
import { pick } from 'lodash-es'
import {
  computed,
  inject,
  provide,
  reactive,
  ref,
  useSlots,
} from 'vue'
import { stylePrefix } from '../__builtins__'
import { FORM_LAYOUT_PROPS_KEYS, formLayoutDeepContext, formLayoutShallowContext, useFormDeepLayout } from '../form-layout/utils'

defineOptions({
  name: 'FFormItem',
})
const props = withDefaults(defineProps<IFormItemProps>(), {
  colon: true,
  feedbackLayout: 'loose',
  fullness: false,
})
const slots = useSlots()
const ns = useNamespace('form-item')
const prefixCls = `${stylePrefix}-form-item`
const formContext = inject(formContextKey, {} as FormContext)
const formItemConfig: Partial<IFormLayoutProps> = Object.fromEntries(
  Object.entries(pick(props, FORM_LAYOUT_PROPS_KEYS))
    .filter(([_, value]) => value !== undefined && value !== null),
)
provide(formLayoutShallowContext, ref(formItemConfig) as Ref<IFormLayoutProps>)
const formDeepLayout = inject(formLayoutDeepContext, {})
const formlayout = Object.assign({}, formDeepLayout, formItemConfig)
const field = useField()

const _size = useFormSize(undefined, { formItem: false })
const _colon = computed(() => {
  if (isBoolean(formlayout.colon)) {
    return formlayout.colon ?? true
  }
  return formlayout?.colon ?? true
})

const _validateState = computed(() => {
  if (props.feedbackStatus === 'pending') {
    return 'validating'
  }
  return props.feedbackStatus
})

const labelId = useId().value
const inputIds = ref<string[]>([])

const validateState = ref<FormItemValidateState>('')
const validateStateDebounced = refDebounced(validateState, 100)
const validateMessage = ref('')
const formItemRef = ref<HTMLDivElement>()
const labelRef = ref<HTMLElement>()

const labelPosition = computed(
  () => {
    if (formlayout.layout === 'vertical' || (isArr(formlayout.layout) && formlayout.layout.includes('vertical' as any))) {
      return 'top'
    }
    return formlayout.labelAlign
  },
)

const labelStyle = computed<CSSProperties>(() => {
  if (labelPosition.value === 'top') {
    return {}
  }

  const labelWidth = addUnit(formlayout.labelWidth || formContext?.labelWidth || '')
  if (labelWidth)
    return { width: labelWidth }
  return {}
})

const contentStyle = computed<CSSProperties>(() => {
  const contentWidth = addUnit(formlayout?.wrapperWidth || '')
  if (contentWidth)
    return { width: contentWidth, flex: 'unset' }
  return {}
})

const contentWrapperStyle = computed<CSSProperties>(() => {
  return {
    justifyContent: formlayout?.wrapperAlign === 'right' && 'flex-end',
  }
})

const isRequired = computed(() =>
  props.required && field.value.pattern !== 'readPretty',
)

const formItemClasses = computed(() => [
  ns.b(),
  ns.m(_size.value),
  ns.is(props.feedbackStatus),
  ns.is('validating', validateState.value === 'validating'),
  ns.is('success', validateState.value === 'success'),
  ns.is('required', isRequired.value || props.asterisk),
  ns.is('no-asterisk', formContext?.hideRequiredAsterisk),
  ns.is(formlayout.feedbackLayout),
  formContext?.requireAsteriskPosition === 'right'
    ? 'asterisk-right'
    : 'asterisk-left',
  {
    [ns.m('feedback')]: formContext?.statusIcon,
    [ns.m(`label-${labelPosition.value}`)]: labelPosition.value,
  },
])

const validateClasses = computed(() => [`${prefixCls}-feedback`, ns.is(props.feedbackStatus)])

const hasLabel = computed<boolean>(() => {
  return !!(props.label || slots.label)
})

const labelFor = computed<string | undefined>(() => {
  return (
    props.for || (inputIds.value.length === 1 ? inputIds.value[0] : undefined)
  )
})

const isGroup = computed<boolean>(() => {
  return !labelFor.value && hasLabel.value
})

const shouldShowError = computed(
  () =>
    validateStateDebounced.value === 'error',
)

async function validate(): FormValidationResult {
  return true
}

const clearValidate: FormItemContext['clearValidate'] = () => {}

const resetField: FormItemContext['resetField'] = async () => {
  // const model = formContext?.model
  // if (!model || !props.prop)
  //   return

  // const computedValue = getProp(model, props.prop)

  // // prevent validation from being triggered
  // isResettingField = true

  // computedValue.value = clone(initialValue)

  // await nextTick()
  // clearValidate()

  // isResettingField = false
}

const addInputId: FormItemContext['addInputId'] = (id: string) => {
  if (!inputIds.value.includes(id)) {
    inputIds.value.push(id)
  }
}

const removeInputId: FormItemContext['removeInputId'] = (id: string) => {
  inputIds.value = inputIds.value.filter(listId => listId !== id)
}

// watch(
//   () => props.error,
//   (val) => {
//     validateMessage.value = val || ''
//     setValidationState(val ? 'error' : '')
//   },
//   { immediate: true },
// )

// watch(
//   () => props.validateStatus,
//   val => setValidationState(val || ''),
// )
function isEllipsisActive(element) {
  if (!element)
    return false
  return element.scrollWidth > element.clientWidth
}
const isEllipsis = computed(() => {
  return isEllipsisActive(labelRef.value) && !formlayout.labelWrap
})
const context: FormItemContext = reactive({
  $el: formItemRef,
  labelWidth: formlayout?.labelWidth,
  size: _size,
  validateState: _validateState.value,
  labelId,
  inputIds,
  isGroup,
  hasLabel,
  addInputId,
  removeInputId,
  resetField,
  clearValidate,
  validate,
  labelPosition,
  inlineMessage: true,
  showMessage: true,
  fieldValue: undefined,
})

provide(formItemContextKey, context)
</script>

<template>
  <div
    ref="formItemRef"
    :class="[prefixCls, formlayout.labelWrap && 'is-warp', ...formItemClasses]"
    :role="isGroup ? 'group' : undefined"
    :aria-labelledby="isGroup ? labelId : undefined"
  >
    <component
      :is="labelFor ? 'label' : 'div'"
      v-if="hasLabel"
      :id="labelId" :for="labelFor"
      :class="{
        [ns.e('label')]: true,
      }"
      :style="labelStyle"
    >
      <!-- label -->
      <div :class="`${prefixCls}-label__wrapper`">
        <slot name="label" :label="props.label">
          <ElTooltip :disabled="!isEllipsis && formlayout.tooltipLayout !== 'text'">
            <span
              :class="{
                [`${prefixCls}-label-content`]: true,
                ['is-tooltip']: isEllipsis || (props.tooltip && formlayout.tooltipLayout === 'text'),
              }"
            >
              <span ref="labelRef">{{ props.label }}</span>
            </span>
            <template #content>
              <div :style="`width: ${labelRef?.clientWidth ?? 0}px;`">
                <template v-if="isEllipsis">
                  {{ props.label }}
                </template>
                <template v-if="formlayout.tooltipLayout === 'text'">
                  {{ props.tooltip }}
                </template>
              </div>
            </template>
          </ElTooltip>
        </slot>
        <ElTooltip v-if="props.tooltip && formlayout.tooltipLayout !== 'text'" :content="props.tooltip">
          <ElIcon :class="`${prefixCls}-label-tooltip`">
            <InfoFilled />
          </ElIcon>
        </ElTooltip>
        <span v-if="_colon" :class="`${prefixCls}-colon`">:</span>
      </div>
    </component>
    <!-- content -->
    <div :class="`${prefixCls}-content__wrapper`" :style="contentWrapperStyle">
      <div v-if="props.addonBefore" :class="`${prefixCls}-addon-before`">
        {{ props.addonBefore }}
      </div>
      <div :class="[ns.e('content'), formlayout.fullness && 'is-fullness']" :style="contentStyle">
        <slot />
        <transition-group :name="`${ns.namespace.value}-zoom-in-top`">
          <slot name="error" :error="validateMessage">
            <div :class="validateClasses">
              {{ props.feedbackText }}
            </div>
          </slot>
          <slot name="extra">
            <div :class="`${prefixCls}-extra`">
              {{ props.extra }}
            </div>
          </slot>
        </transition-group>
      </div>
      <div v-if="props.addonAfter" :class="`${prefixCls}-addon-after`">
        {{ props.addonAfter }}
      </div>
    </div>
  </div>
</template>
