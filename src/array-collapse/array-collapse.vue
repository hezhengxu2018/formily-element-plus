<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import { autorun, observable } from '@formily/reactive'
import { isArr, isFn } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'

import {
  ElBadge,
  ElCard,
  ElCollapse,
  ElCollapseItem,
  ElEmpty,
  ElRow,
} from 'element-plus'
import { ref, useAttrs, watchEffect } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { ArrayBase } from '../array-base'
import { isAdditionComponent, isIndexComponent, isOperationComponent } from '../array-base/utils'

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

const prefixCls = `${stylePrefix}-array-collapse`
const activeKeys = ref<number[] | number>([])

const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

const dataSource = ref(field.value)

autorun(() => {
  dataSource.value = [...field.value]
})

const panelErrorCounts = observable.computed(() => {
  return field.value?.map((item, index) => field.form.queryFeedbacks({ type: 'error', address: `${field.address.concat(index)}.**` }).length)
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
function getCollapseItemClass(index: number) {
  // console.log(index, field.query(`${field.address}.${index}`).get('componentProps'))
  return ({
    ...schema.items?.['x-component-props'],
    ...field.query(`${field.address}.${index}`).get('componentProps'),
  })
}
</script>

<template>
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
    <div :class="prefixCls">
      <!-- 空状态渲染 -->
      <template v-if="!Array.isArray(props.value) || props.value.length === 0">
        <ElCard
          :class="[`${prefixCls}-item`]"
          shadow="never"
          v-bind="attrs"
          :header="attrs.title || field.title"
        >
          <ElEmpty />
        </ElCard>
      </template>

      <!-- 数据项渲染 -->
      <template v-else>
        <ElCollapse
          :key="props.value.length"
          :model-value="activeKeys"
          :class="[`${prefixCls}-item`]"
          @change="handleCollapseChange"
        >
          <ElCollapseItem
            v-for="(item, index) of dataSource"
            :key="getKey(item, index)"
            :name="index"
          >
            <template #title>
              <ElRow style="flex: 1" type="flex" justify="space-between">
                <span>
                  <ArrayBase.Item :index="index" :record="item">
                    <!-- 渲染索引组件 -->
                    <RecursionField
                      :schema="schema.items"
                      :name="index"
                      :filter-properties="(schema: ISchema) => isIndexComponent(schema)"
                      :only-render-properties="true"
                    />
                    <ElBadge
                      v-if="panelErrorCounts.value[index] !== 0"
                      :class="`${prefixCls}-errors-badge`"
                      :value="panelErrorCounts.value[index]"
                    >
                      <component
                        :is="() => isFn(schema['x-content']?.title)
                          ? schema['x-content']?.title(panelErrorCounts.value[index])
                          : schema['x-content']?.title"
                        v-if="schema['x-content']?.title"
                      />
                      <span v-else>{{ schema['x-component-props']?.title }}</span>
                    </ElBadge>
                    <template v-else>
                      <component
                        :is="() => isFn(schema['x-content']?.title)
                          ? schema['x-content']?.title(panelErrorCounts.value[index])
                          : schema['x-content']?.title"
                        v-if="schema['x-content']?.title"
                      />
                      <template v-else>
                        {{ schema['x-component-props']?.title }}
                      </template>
                    </template>
                    <!-- 渲染标题和错误提示 -->
                    <template v-if="field.form.queryFeedbacks({ type: 'error', address: `${field.address.concat(index)}.**` }).length > 0">
                      <ElBadge
                        :class="[`${prefixCls}-errors-badge`]"
                        :value="field.form.queryFeedbacks({ type: 'error', address: `${field.address.concat(index)}.**` }).length"
                      >
                        {{ field.query(`${field.address}.${index}`).get('componentProps')?.title
                          || schema.items?.['x-component-props']?.title
                          || field.title }}
                      </ElBadge>
                    </template>
                    {{ schema.items?.['x-component-props']?.title || field.title }}
                  </ArrayBase.Item>
                </span>
                <span>
                  <ArrayBase.Item :index="index" :record="item">
                    <!-- 渲染操作组件 -->
                    <RecursionField
                      :schema="Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items"
                      :name="index"
                      :filter-properties="(schema: ISchema) => isOperationComponent(schema)"
                      :only-render-properties="true"
                    />
                  </ArrayBase.Item>
                </span>
              </ElRow>
            </template>
            <ArrayBase.Item :index="index" :record="item">
              <!-- 渲染内容组件 -->
              <RecursionField
                :schema="Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items"
                :name="index"
                :filter-properties="(schema: ISchema) => !isIndexComponent(schema) && !isOperationComponent(schema)"
              />
            </ArrayBase.Item>
          </ElCollapseItem>
        </ElCollapse>
      </template>

      <!-- 渲染添加按钮 -->
      <template v-for="(itemSchema, key) in schema.properties" :key="key">
        <RecursionField
          v-if="isAdditionComponent(itemSchema)"
          :schema="itemSchema"
          name="addition"
        />
      </template>
    </div>
  </ArrayBase>
</template>
