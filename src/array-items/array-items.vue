<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import { isArr } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { VueDraggable } from 'vue-draggable-plus'
import { stylePrefix } from '../__builtins__/configs'
import { ArrayBase } from '../array-base'
import { useKey, isAdditionComponent } from '../array-base/utils'
import { autorun } from '@formily/reactive'
import { ref } from 'vue'

defineOptions({
  name: 'FArrayItems',
  inheritAttrs: false,
})

const fieldRef = useField<ArrayField>()
const schemaRef = useFieldSchema()
const field = fieldRef.value
const schema = schemaRef.value

const prefixCls = `${stylePrefix}-array-items`
const { getKey, keyMap } = useKey(schemaRef.value)
const dataSource = ref(field.value??[])
autorun(() => {
  dataSource.value = [...field.value]
})
function getItems(element: any, index: number) {
  return isArr(schema.items)
    ? schema.items[index] || schema.items[0]
    : schema.items
}

async function handleDragEnd(evt: { oldIndex: number, newIndex: number }) {
  const { oldIndex, newIndex } = evt
  if (isArr(keyMap)) {
    keyMap.splice(newIndex, 0, keyMap.splice(oldIndex, 1)[0])
  }
  await field.move(oldIndex, newIndex)
}
</script>

<template>
  <ArrayBase :key-map="keyMap">
    <div :class="prefixCls">
      <VueDraggable
        :class="`${prefixCls}-list`"
        :model-value="dataSource"
        :handle="`.${stylePrefix}-array-base-sort-handle`"
        :animation="150"
        @end="handleDragEnd"
      >
        <ArrayBase.Item
          v-for="(element, index) of dataSource"
          :key="getKey(element, index)"
          :index="index"
          :record="element"
        >
          <div :key="getKey(element, index)" :class="[`${prefixCls}-item-inner`]" :index="index">
            <RecursionField :schema="getItems(schema.items, index)" :name="index" />
          </div>
        </ArrayBase.Item>
      </VueDraggable>

      <template v-for="(itemSchema, key) of schema.properties" :key="key">
        <RecursionField v-if="isAdditionComponent(itemSchema)" :schema="itemSchema" name="addition" />
      </template>
    </div>
  </ArrayBase>
</template>
