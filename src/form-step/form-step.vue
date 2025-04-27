<script setup lang="ts">
import type { VoidField } from '@formily/core'
import type { IFormStepProps } from './types'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElStep, ElSteps } from 'element-plus'
import { computed } from 'vue'
import { stylePrefix } from '../__builtins__'
import { createFormStep, parseSteps } from './utils'

defineOptions({
  name: 'FFormStep',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IFormStepProps>(), {
  formStep: () => createFormStep(),
})

const field = useField<VoidField>().value
const prefixCls = `${stylePrefix}-form-step`
const fieldSchemaRef = useFieldSchema()

const steps = parseSteps(fieldSchemaRef.value)

props.formStep.connect?.(steps, field)

const current = computed(() => props.active ?? props.formStep?.current ?? 0)
</script>

<template>
  <div :class="prefixCls">
    <ElSteps
      v-bind="$attrs"
      :active="current"
      :style="[{ marginBottom: '10px' }]"
    >
      <ElStep
        v-for="({ props: stepProps }, key) of steps"
        :key="key"
        v-bind="stepProps"
      />
    </ElSteps>

    <template v-for="({ name, schema }, key) of steps" :key="name">
      <RecursionField
        v-if="key === current"
        :name="name"
        :schema="schema"
      />
    </template>
  </div>
</template>
