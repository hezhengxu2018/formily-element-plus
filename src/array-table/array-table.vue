<script setup lang="ts">
import type { ArrayField } from '@formily/core'
import type { Schema } from '@formily/vue'
import { autorun, observable } from '@formily/reactive'
import { isArr } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElTable, ElTableColumn, vLoading } from 'element-plus'
import { computed, ref } from 'vue'
import { ArrayBase } from '../array-base'
import { isAdditionComponent } from '../array-base/utils'
import { isColumnComponent, isTableComponent, prefixCls } from './utils'

defineOptions({
  name: 'FArrayTable',
  inheritAttrs: false,
})

const fieldRef = useField<ArrayField>()
const field = fieldRef.value
const schemaRef = useFieldSchema()
const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

function extractTableSources(schema: Schema): any[] {
  if (isTableComponent(schema)) {
    return createTableSource(schema)
  }
  return schema.properties
    ? Object.values(schema.properties).flatMap(element => extractTableSources(element))
    : []
}

function createTableSource(schema: Schema): any[] {
  const propName = schema['x-component-props']?.prop || schema.name
  if (!propName)
    return []

  const field = fieldRef.value.query(fieldRef.value.address.concat(propName)).take()

  return [{
    name: propName,
    display: field?.display || schema['x-display'],
    required: hasRequiredProperty(schema),
    field,
    fieldProps: field?.props || schema.toFieldProps(),
    schema,
    columnProps: (field?.component as any[])?.[1] || schema['x-component-props'] || {},
  }]
}

function hasRequiredProperty(schema: Schema): boolean {
  return schema.reduceProperties((hasRequired, property) =>
    hasRequired || !!property.required, false)
}

const sources = observable.computed(() => {
  const schema = schemaRef.value.items
  const items = isArr(schema) ? schema : [schema]
  return items.reduce((columns, schema) => {
    const item = extractTableSources(schema)
    if (item) {
      return columns.concat(item)
    }
    return columns
  }, [])
})

const dataSource = ref([])
autorun(() => {
  dataSource.value = [...field.value]
})

const columns = observable.computed(() => {
  return sources.value
    .map((source, index) => ({ source, index }))
    .filter(({ source }) => source.display === 'visible' && isColumnComponent(source.schema))
    .map(({ source, index: key }) => {
      const { name, columnProps, required } = source
      const { title, asterisk, ...restProps } = columnProps
      const props = {
        label: title,
        ...restProps,
        prop: name,
      }
      return {
        key,
        props,
        asterisk: asterisk ?? required,
      }
    })
})

const stateManagerColumns = computed(() => {
  return sources.value.filter(column => isColumnComponent(column.schema))
})
</script>

<template>
  <div :class="prefixCls">
    <ArrayBase :key-map="keyMap">
      <ElTable
        v-loading="field.loading"
        :row-key="getKey"
        :data="dataSource"
      >
        <template v-for="(column, colIndex) of columns.value" :key="column.key">
          <ElTableColumn v-bind="column.props">
            <template #default="{ row, $index }">
              <ArrayBase.Item :key="getKey(row)" :index="$index" :record="row">
                <RecursionField :key="`${getKey(row)}-${colIndex}`" :schema="sources.value[colIndex].schema" :name="$index" only-render-properties />
              </ArrayBase.Item>
            </template>
            <template v-if="column.asterisk" #header="{ column: col }">
              <span>
                <span :class="`${prefixCls}-asterisk`">*</span>
                {{ col.label }}
              </span>
            </template>
          </ElTableColumn>
        </template>
      </ElTable>

      <!-- 状态管理器 -->
      <template v-for="(column, key) of stateManagerColumns" :key="key">
        <RecursionField
          :name="column.name"
          :schema="column.schema"
          :only-render-self="true"
        />
      </template>
      <template v-for="(itemSchema, key) of schemaRef.properties" :key="key">
        <RecursionField v-if="isAdditionComponent(itemSchema)" :schema="itemSchema" name="addition" />
      </template>
    </ArrayBase>
  </div>
</template>
