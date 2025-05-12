<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import { isArr } from '@formily/shared'
import { FormConsumer, RecursionField, useField, useFieldSchema } from '@formily/vue'
import { VueDraggable } from 'vue-draggable-plus'
import { stylePrefix } from '../__builtins__/configs'
import { ArrayBase } from '../array-base'
import { useKey } from '../array-base/utils'

defineOptions({
  name: 'FArrayItems',
  inheritAttrs: false,
})

const fieldRef = useField<ArrayField>()
const schemaRef = useFieldSchema()

const prefixCls = `${stylePrefix}-array-items`
const { getKey, keyMap } = useKey(schemaRef.value)

const field = fieldRef.value
const schema = schemaRef.value

function isAdditionComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Addition') > -1
}

function handleDragEnd(evt: { oldIndex: number, newIndex: number }) {
  const { oldIndex, newIndex } = evt
  if (isArr(keyMap)) {
    keyMap.splice(newIndex, 0, keyMap.splice(oldIndex, 1)[0])
  }
  field.move(oldIndex, newIndex)
}
</script>

<template>
  <FormConsumer>
    <ArrayBase :key-map="keyMap">
      <div :class="prefixCls">
        <VueDraggable
          :class="`${prefixCls}-list`"
          :model-value="fieldRef.value"
          :handle="`.${stylePrefix}-array-base-sort-handle`"
          :animation="150"
          @end="handleDragEnd"
        >
          <ArrayBase.Item
            v-for="(element, index) of fieldRef.value"
            :key="getKey(element, index)"
            :index="index"
            :record="element"
          >
            <div :key="getKey(element, index)" :class="[`${prefixCls}-item-inner`]" :index="index">
              <RecursionField :schema="schema.items" :name="index" />
            </div>
          </ArrayBase.Item>
        </VueDraggable>

        <template v-for="(itemSchema, key) of schema.properties" :key="key">
          <RecursionField v-if="isAdditionComponent(itemSchema)" :schema="itemSchema" name="addition" />
        </template>
      </div>
    </ArrayBase>
  </FormConsumer>
</template>
