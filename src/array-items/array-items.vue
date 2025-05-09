<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import { autorun } from '@formily/reactive'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { stylePrefix } from '../__builtins__/configs'
import { ArrayBase } from '../array-base'

defineOptions({
  name: 'FArrayItems',
  inheritAttrs: false,
})

const fieldRef = useField<ArrayField>()
const schemaRef = useFieldSchema()
const dataSource = ref([])
autorun(() => {
  dataSource.value = [...fieldRef.value.value]
})

const prefixCls = `${stylePrefix}-array-items`
const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

const field = fieldRef.value
const schema = schemaRef.value

function isAdditionComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Addition') > -1
}

function getItems(element: any, index: number) {
  return Array.isArray(schema.items)
    ? schema.items[index] || schema.items[0]
    : schema.items
}

function handleDragEnd(evt: { oldIndex: number, newIndex: number }) {
  const { oldIndex, newIndex } = evt
  if (Array.isArray(keyMap)) {
    keyMap.splice(newIndex, 0, keyMap.splice(oldIndex, 1)[0])
  }
  field.move(oldIndex, newIndex)
}
</script>

<template>
  <ArrayBase :key-map="keyMap">
    <div :class="prefixCls">
      <VueDraggable
        :class="[`${prefixCls}-list`]"
        :model-value="dataSource"
        :handle="`.${stylePrefix}-array-base-sort-handle`"
        :animation="150"
        @end="handleDragEnd"
      >
        <ArrayBase.Item
          v-for="(element, index) of dataSource"
          :key="getKey(element, index)"
          :index="index" :record="element"
        >
          <div :key="getKey(element, index)" :class="[`${prefixCls}-item-inner`]" :index="index">
            <RecursionField :schema="getItems(element, index)" :name="index" />
          </div>
        </ArrayBase.Item>
      </VueDraggable>

      <template v-for="(itemSchema, key) of schema.properties" :key="key">
        <RecursionField v-if="isAdditionComponent(itemSchema)" :schema="itemSchema" name="addition" />
      </template>
    </div>
  </ArrayBase>
</template>
