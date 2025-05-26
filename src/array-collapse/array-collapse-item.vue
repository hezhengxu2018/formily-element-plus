<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/vue'
import { observable } from '@formily/reactive'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElBadge, ElCollapseItem } from 'element-plus'
import { omit } from 'lodash-es'
import { computed, useAttrs } from 'vue'
import { isIndexComponent, isOperationComponent, useIndex } from '../array-base/utils'
import { prefixCls } from './utils'

defineOptions({
  name: 'FArrayCollapseItem',
  inheritAttrs: false,
})

const fieldRef = useField<ArrayField>()
const field = fieldRef.value
const schemaRef = useFieldSchema()
const schema = schemaRef.value.parent
const index = useIndex()
const errorCount = observable.computed(() => {
  const path = field.address.concat()
  return field.form.queryFeedbacks({
    type: 'error',
    address: `${path}.**`,
  }).length
})
const attrs = useAttrs()
const innerAtts = omit(attrs, ['value', 'onChange', 'readOnly'])
</script>

<template>
  <ElCollapseItem :name="index" v-bind="innerAtts">
    <template #title>
      <div style="flex: 1;">
        <RecursionField
          :schema="schema.items"
          :name="index"
          :filter-properties="(schema: ISchema) => isIndexComponent(schema)"
          :only-render-properties="true"
        />
        <slot name="title">
          <ElBadge
            :class="[`${prefixCls}-errors-badge`]"
            :value="errorCount.value"
            :offset="[5, -2]"
            :hidden="errorCount.value === 0"
          >
            {{ schema.items?.['x-component-props']?.title }}
          </ElBadge>
        </slot>
      </div>
      <div>
        <RecursionField
          :schema="Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items"
          :name="index"
          :filter-properties="(schema: ISchema) => isOperationComponent(schema)"
          :only-render-properties="true"
        />
      </div>
    </template>
    <slot />
  </ElCollapseItem>
</template>
