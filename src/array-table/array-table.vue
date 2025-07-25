<script setup lang="ts">
import type { ArrayField } from '@formily/core'
import type { Schema } from '@formily/vue'
import type { TableInstance } from 'element-plus'
import type { IArrayTableProps } from './types'
import { autorun, observable, reaction } from '@formily/reactive'
import { isArr, isEqual } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElTable, ElTableColumn, vLoading } from 'element-plus'
import { omit } from 'lodash-es'
import { computed, nextTick, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { stylePrefix, useCleanAttrs } from '../__builtins__'
import { ArrayBase } from '../array-base'
import { isAdditionComponent } from '../array-base/utils'
import ElPagination from '../pagination/pagination'
import { hasRequiredProperty, isColumnComponent, isTableComponent, prefixCls } from './utils'

defineOptions({
  name: 'FArrayTable',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IArrayTableProps>(), {
  value: () => [],
  pagination: true,
})
const { props: elTableProps } = useCleanAttrs()
const paginationProps = computed(() => omit(props.paginationProps, ['pageSize', 'currentPage']))
const fieldRef = useField<ArrayField>()
const field = fieldRef.value
const schemaRef = useFieldSchema()
const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

const elTableRef = ref<TableInstance>()

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
  /* istanbul ignore if -- @preserve */
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

const triggerUpdateKey = ref(0)
reaction(() => {
  const path = field.path.entire
  return field.query(`${path}.*`).map((item) => {
    return {
      name: item.component[0],
      visible: item.visible,
    }
  }).filter(item => item.name.includes('Column'))
}, async () => {
  triggerUpdateKey.value++
}, { equals: isEqual })

const dataSource = ref([])
const pageSize = ref(props.paginationProps?.pageSize ?? 10)
const currentPage = ref(props.paginationProps?.currentPage ?? 1)

function updateDataSource() {
  if (props.pagination === false) {
    dataSource.value = [...field.value]
    return
  }
  dataSource.value = field.value.slice((currentPage.value - 1) * pageSize.value, (currentPage.value) * pageSize.value)
}
watch([pageSize, currentPage], updateDataSource)
autorun(updateDataSource)

const sources = observable.computed(() => {
  const schema = schemaRef.value.items
  const items = isArr(schema) ? schema : [schema]
  return items.reduce((columns, schema) => {
    const item = extractTableSources(schema)
    return columns.concat(item)
  }, []).filter(item => item.display !== 'none')
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

const stateManagerColumns = observable.computed(() => {
  return sources.value.filter((column) => {
    return column.display !== 'none' && isColumnComponent(column.schema)
  })
})

const baseIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

async function onAddItemClick() {
  if (props.pagination === false) {
    await nextTick()
    const scrollWarpDOM = elTableRef.value?.$el.querySelector('.el-scrollbar__wrap')
    scrollWarpDOM?.scrollTo({
      top: scrollWarpDOM.scrollHeight,
      behavior: 'smooth',
    })
    return
  }
  currentPage.value = Math.ceil(field.value.length / pageSize.value)
}

async function handleDragEnd(evt: { oldIndex: number, newIndex: number }) {
  const { oldIndex, newIndex } = evt
  await field.move(oldIndex, newIndex)
  triggerUpdateKey.value++
}
</script>

<template>
  <div :class="prefixCls">
    <ArrayBase :key="triggerUpdateKey" :key-map="keyMap" :add="onAddItemClick">
      <VueDraggable
        :model-value="dataSource"
        target="tbody"
        :handle="`.${stylePrefix}-array-base-sort-handle`"
        :animation="150"
        @end="handleDragEnd"
      >
        <ElTable ref="elTableRef" v-loading="field.loading" :row-key="getKey" :data="dataSource" v-bind="elTableProps">
          <template v-for="(column, colIndex) of columns.value" :key="column.key">
            <ElTableColumn v-bind="column.props">
              <template #default="{ row, $index }">
                <ArrayBase.Item :key="getKey(row)" :index="$index + baseIndex" :record="row">
                  <RecursionField
                    :key="`${getKey(row)}`"
                    :schema="sources.value[colIndex].schema"
                    :name="$index + baseIndex"
                    only-render-properties
                  />
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
      </VueDraggable>

      <!-- 状态管理器 -->
      <template v-for="(column, key) of stateManagerColumns.value" :key="key">
        <RecursionField :name="column.name" :schema="column.schema" :only-render-self="true" />
      </template>
      <ElPagination
        v-if="props.pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :class="`${prefixCls}-pagination`"
        background
        layout="total, sizes, prev, pager, next"
        :total="props.value.length"
        v-bind="paginationProps"
      />
      <template v-for="(itemSchema, key) of schemaRef.properties" :key="key">
        <RecursionField v-if="isAdditionComponent(itemSchema)" :schema="itemSchema" name="addition" />
      </template>
    </ArrayBase>
  </div>
</template>
