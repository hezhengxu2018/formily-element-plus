<script lang="ts" setup>
import type { Field } from '@formily/core'
import type {
  FormItemContext,
  FormItemValidateState,
  FormValidationResult,
} from 'element-plus'
import type { ICalculatedFormLayoutProps } from 'src/form-layout/types'
import type { CSSProperties } from 'vue'
import type { IFormItemProps } from './types'
import { CircleCheck, CircleClose, InfoFilled, Warning } from '@element-plus/icons-vue'
import { isArr } from '@formily/shared'
import { useField } from '@formily/vue'
import { useResizeObserver } from '@vueuse/core'
import { ElIcon, ElTooltip, formItemContextKey, useFormSize, useId, useNamespace } from 'element-plus'
import { addUnit } from 'element-plus/es/utils/index'
import { isNil, pick } from 'lodash-es'
import {
  computed,
  provide,
  reactive,
  ref,
  useSlots,
} from 'vue'
import { stylePrefix } from '../__builtins__'
import { FORM_LAYOUT_PROPS_KEYS, formLayoutShallowContext, useFormLayout } from '../form-layout/utils'

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
const formItemConfig: Partial<ICalculatedFormLayoutProps> = Object.fromEntries(
  Object.entries(pick(props, FORM_LAYOUT_PROPS_KEYS))
    .filter(([_, value]) => !isNil(value)),
)
const formlayoutConfig = useFormLayout()
const formlayout = computed(() => Object.assign({}, formlayoutConfig.value, formItemConfig))

const field = useField<Field>()

const _size = useFormSize(undefined, { formItem: false })

const _validateState = computed(() => {
  if (props.feedbackStatus === 'pending') {
    return 'validating'
  }
  if (props.feedbackStatus === 'warning') {
    return ''
  }
  return props.feedbackStatus
})

const labelId = useId().value
const inputIds = ref<string[]>([])

const validateState = ref<FormItemValidateState>('')
const formItemRef = ref<HTMLDivElement>()
const labelRef = ref<HTMLElement>()

const labelPosition = computed(
  () => {
    if (formlayout.value.layout === 'vertical' || (isArr(formlayout.value.layout) && formlayout.value.layout.includes('vertical' as any))) {
      return 'top'
    }
    return formlayout.value.labelAlign
  },
)

const labelStyle = computed<CSSProperties>(() => {
  if (labelPosition.value === 'top') {
    return {}
  }

  const labelWidth = addUnit(formlayout.value.labelWidth || '')
  if (labelWidth)
    return { width: labelWidth }
  return {}
})

const contentStyle = computed<CSSProperties>(() => {
  const contentWidth = addUnit(formlayout.value?.wrapperWidth || '')
  if (contentWidth)
    return { width: contentWidth, flex: 'unset' }
  return {}
})

const contentWrapperStyle = computed<CSSProperties>(() => {
  return {
    justifyContent: formlayout.value?.wrapperAlign === 'right' && 'flex-end',
  }
})

const isRequired = computed(() =>
  props.asterisk && field.value?.pattern !== 'readPretty',
)

const formItemClasses = computed(() => [
  ns.b(),
  // eslint-disable-next-line unicorn/explicit-length-check
  ns.m(props.size || _size.value || 'default'),
  ns.is(props.feedbackStatus),
  ns.is('validating', validateState.value === 'validating'),
  ns.is('success', validateState.value === 'success'),
  ns.is('required', isRequired.value || props.asterisk),
  ns.is('no-asterisk', formlayout.value?.hideRequiredAsterisk),
  ns.is(formlayout.value.feedbackLayout),
  formlayout.value?.requireAsteriskPosition === 'right'
    ? 'asterisk-right'
    : 'asterisk-left',
  {
    [ns.m('feedback')]: formlayout.value?.statusIcon,
    [ns.m(`label-${labelPosition.value}`)]: labelPosition.value,
  },
])

const validateClasses = computed(() => [
  `${prefixCls}-feedback`,
  ns.is(props.feedbackStatus),
  ns.is('loose', props.feedbackLayout === 'loose'),
])

const hasLabel = computed<boolean>(() => {
  return (props.label !== '' && !isNil(props.label)) || !isNil(slots.label)
})

const labelFor = computed<string | undefined>(() => {
  return (
    props.for || (inputIds.value.length === 1 ? inputIds.value[0] : undefined)
  )
})

const isGroup = computed<boolean>(() => {
  return !labelFor.value && hasLabel.value
})

async function validate(): FormValidationResult {
  return true
}

const clearValidate: FormItemContext['clearValidate'] = () => {}

const resetField: FormItemContext['resetField'] = async () => {}

const addInputId: FormItemContext['addInputId'] = (id: string) => {
  if (!inputIds.value.includes(id)) {
    inputIds.value.push(id)
  }
}

const removeInputId: FormItemContext['removeInputId'] = (id: string) => {
  inputIds.value = inputIds.value.filter(listId => listId !== id)
}

const isEllipsisActive = ref(false)
useResizeObserver(labelRef, () => {
  isEllipsisActive.value = labelRef.value?.scrollWidth > labelRef.value?.clientWidth
})
const isEllipsis = computed(() => {
  return isEllipsisActive.value && !formlayout.value.labelWrap
})

const context: FormItemContext = reactive({
  $el: formItemRef,
  labelWidth: formlayout.value?.labelWidth,
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
  fieldValue: field.value?.value,
})

provide(formItemContextKey, context)
provide(formLayoutShallowContext, ref({}))
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
      :class="[ns.e('label'), !isNil(formlayout.labelCol) && `${prefixCls}-col-${formlayout.labelCol}`]"
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
        <span v-if="props.colon" :class="`${prefixCls}-colon`">:</span>
      </div>
    </component>
    <!-- content -->
    <div
      :class="[
        `${prefixCls}-content__wrapper`,
        !isNil(formlayout.wrapperCol) && `${prefixCls}-col-${formlayout.wrapperCol}`,
      ]"
      :style="contentWrapperStyle"
    >
      <div
        v-if="props.addonBefore"
        :class="`${prefixCls}-addon-before`"
      >
        {{ props.addonBefore }}
      </div>
      <div :class="[ns.e('content'), formlayout.fullness && 'is-fullness']" :style="contentStyle">
        <ElTooltip
          v-if="props.feedbackLayout === 'popover'"
          :visible="!!props.feedbackText"
          effect="light"
          :offset="6"
        >
          <template #default>
            <slot />
          </template>
          <template #content>
            <div :class="[...validateClasses, ns.is('tooltip')]">
              <ElIcon>
                <CircleClose v-if="props.feedbackStatus === 'error'" />
                <CircleCheck v-if="props.feedbackStatus === 'success'" />
                <Warning v-if="props.feedbackStatus === 'warning'" />
              </ElIcon>
              {{ props.feedbackText }}
            </div>
          </template>
        </ElTooltip>
        <slot v-else />
        <transition-group :name="`${ns.namespace.value}-zoom-in-top`">
          <slot name="error">
            <div v-if="props.feedbackText && props.feedbackLayout !== 'popover'" :class="validateClasses">
              {{ props.feedbackText }}
            </div>
          </slot>
          <slot name="extra">
            <div v-if="props.extra" :class="`${prefixCls}-extra`">
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
