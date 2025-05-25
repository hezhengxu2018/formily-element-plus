<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import { autorun } from '@formily/reactive'
import { isArr } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import {
  ElCard,
  ElCollapse,
  ElEmpty,
} from 'element-plus'
import { omit } from 'lodash-es'
import { ref, useAttrs, watchEffect } from 'vue'
import { ArrayBase } from '../array-base'
import { isAdditionComponent, isIndexComponent, isOperationComponent } from '../array-base/utils'
import { prefixCls } from './utils'

defineOptions({
  name: 'FArrayCollapse',
  inheritAttrs: false,
})

const props = defineProps({
  value: {},
  defaultOpenPanelCount: {
    type: Number,
    default: 5,
  },
})

const attrs = useAttrs()
const fieldRef = useField<ArrayField>()
const schemaRef = useFieldSchema()
const field = fieldRef.value
const schema = schemaRef.value

const activeKeys = ref<number[] | number>([])

const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

const dataSource = ref(field.value)

autorun(() => {
  console.log('dataSource', field.value)
  isArr(field.value) && (dataSource.value = [...field.value])
})

function range(count: number) {
  return Array.from({ length: count }).map((_, i) => i)
}

function takeDefaultActiveKeys(dataSourceLength: number, defaultOpenPanelCount: number, accordion = false) {
  if (accordion) {
    return 0
  }
  if (dataSourceLength < defaultOpenPanelCount)
    return range(dataSourceLength)

  return range(defaultOpenPanelCount)
}

function insertActiveKeys(activeKeys: number[] | number, index: number, accordion = false) {
  if (accordion)
    return index
  if (!isArr(activeKeys))
    return index
  if ((activeKeys).length <= index)
    return (activeKeys).concat(index)
  return (activeKeys).reduce((buf, key) => {
    if (key < index)
      return buf.concat(key)
    if (key === index)
      return [...buf, key, key + 1]
    return buf.concat(key + 1)
  }, [])
}

watchEffect(() => {
  if (!field.modified && dataSource.value.length > 0) {
    activeKeys.value = takeDefaultActiveKeys(
      dataSource.value.length,
      props.defaultOpenPanelCount,
      attrs.accordion as boolean,
    )
  }
})

function handleCollapseChange(keys: number[] | number) {
  activeKeys.value = keys
}

const _attrs = omit(attrs, ['onBlur', 'onFocus', 'onChange', 'value', 'modelValue'])
</script>

<template>
  <div :class="prefixCls">
    <ArrayBase
      :key="dataSource.length"
      :key-map="keyMap"
      :add="(index: number) => {
        activeKeys = insertActiveKeys(
          activeKeys,
          index,
          attrs.accordion as boolean,
        )
      }"
    >
      <!-- 空状态渲染 -->
      <template v-if="!Array.isArray(props.value) || props.value.length === 0">
        <ElCard :class="[`${prefixCls}-item`]" shadow="never" v-bind="attrs" :header="attrs.title || field.title">
          <ElEmpty />
        </ElCard>
      </template>

      <!-- 数据项渲染 -->
      <template v-else>
        <ElCollapse
          :model-value="activeKeys"
          :class="`${prefixCls}-item`"
          v-bind="_attrs"
          @change="handleCollapseChange"
        >
          <ArrayBase.Item v-for="(item, index) of dataSource" :key="getKey(item, index)" :index="index" :record="item">
            <RecursionField
              :schema="Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items"
              :name="index"
              :filter-properties="(schema: ISchema) => !isIndexComponent(schema) && !isOperationComponent(schema)"
            />
          </ArrayBase.Item>
        </ElCollapse>
      </template>

      <!-- 渲染添加按钮 -->
      <template v-for="(itemSchema, key) in schema.properties" :key="key">
        <RecursionField v-if="isAdditionComponent(itemSchema)" :schema="itemSchema" name="addition" />
      </template>
    </ArrayBase>
  </div>
</template>
