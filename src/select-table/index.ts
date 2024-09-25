import { defineComponent, h, nextTick, ref, watch } from 'vue'
import { connect, mapProps, useFieldSchema } from '@formily/vue'
import { ElRadio, ElRadioGroup, ElTable, ElTableColumn, version } from 'element-plus'
import { isArr, isFn } from '@formily/shared'
import type { Component, PropType } from 'vue'
import type { Schema } from '@formily/vue'
import type { FieldDisplayTypes, GeneralField } from '@formily/core'
import type { Column, TableInstance, TableProps } from 'element-plus'

import { differenceWith, remove, uniqWith } from 'lodash-es'
import { gt } from 'semver'
import { composeExport, stylePrefix } from '../__builtins__'

type IFilterOption = boolean | ((option: any, keyword: string) => boolean)

type IFilterSort = (optionA: any, optionB: any) => number

export interface ISelectTableProps extends TableProps<any> {
  mode?: 'multiple' | 'single'
  dataSource?: any[]
  optionAsValue?: boolean
  valueType?: 'all' | 'parent' | 'child' | 'path'
  showSearch?: boolean
  // searchProps?: SearchProps
  primaryKey?: string | ((record: any) => string)
  rowKey?: string | ((record: any) => string)
  filterOption?: IFilterOption
  filterSort?: IFilterSort
  onSearch?: (keyword: string) => void
  onChange?: (value: any, options: any) => void
  value?: any
}

interface ObservableColumnSource {
  field?: GeneralField
  columnProps: Column<any>
  schema: Schema
  display: FieldDisplayTypes
  name: string
}

function isColumnComponent(schema: Schema) {
  return schema['x-component']?.indexOf('Column') > -1
}

// function getArrayTableColumns(sources: ObservableColumnSource[]): ColumnProps[] {
//   return sources.reduce(
//     (
//       buf: ColumnProps[],
//       { name, columnProps, schema, display, required },
//       key,
//     ) => {
//       const { title, asterisk, ...props } = columnProps
//       if (display !== 'visible')
//         return buf
//       if (!isColumnComponent(schema))
//         return buf

//       const render = (startIndex?: Ref<number>) => {
//         return columnProps?.type && columnProps?.type !== 'default'
//           ? undefined
//           : (props: {
//             row: Record<string, any>
//             column: ElColumnProps
//             $index: number
//           }): VNode => {
//             const index = (startIndex?.value ?? 0) + props.$index
//             // const index = reactiveDataSource.value.indexOf(props.row)
//             const children = h(
//               ArrayBase.Item,
//               { index, record: props.row, key: `${key}${index}` },
//               {
//                 default: () => {
//                   return h(
//                     RecursionField as any,
//                     {
//                       schema,
//                       name: index,
//                       onlyRenderProperties: true,
//                     },
//                     {},
//                   )
//                 },
//               },
//             )
//             return children
//           }
//       }

//       return (buf as any).concat({
//         label: title,
//         ...props,
//         key,
//         prop: name,
//         asterisk: asterisk ?? required,
//         render,
//       })
//     },
//     [],
//   )
// }

function useSchemaColumns() {
  const schema = useFieldSchema().value
  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (isColumnComponent(schema)) {
      if (!schema['x-component-props']?.prop && !schema.name)
        return []
      const name = schema['x-component-props']?.prop || schema.name
      const columnProps = schema['x-component-props'] || {}
      const display = schema['x-display']
      return [
        {
          name,
          display,
          schema,
          columnProps: {
            prop: name,
            ...columnProps,
          },
        },
      ]
    }
    else if (schema.properties) {
      return schema.reduceProperties<
        ObservableColumnSource[],
        ObservableColumnSource[]
      >((buf, schema) => {
        return buf.concat(parseSources(schema))
      }, [])
    }
    return []
  }

  const parseArrayItems = (schema: Schema['items']) => {
    if (!schema)
      return []
    const sources: ObservableColumnSource[] = []
    const items = isArr(schema) ? schema : [schema]
    return items.reduce((columns, schema) => {
      const item = parseSources(schema)
      if (item) {
        return columns.concat(item)
      }
      return columns
    }, sources)
  }

  const validSchema = (
    schema?.type === 'array' && schema?.items ? schema.items : schema
  ) as Schema

  return parseArrayItems(validSchema)
}

function useColumns(sources: ObservableColumnSource[]): Partial<Column<any>> {
  return sources.reduce<Partial<Column<any>>>(
    (buf, { name, columnProps, schema }, key) => {
      if (!isColumnComponent(schema))
        return buf
      return buf.concat({
        ...columnProps,
        key,
        prop: name,
      })
    },
    [],
  )
}

// function useFlatOptions(tree: any[]) {
//   const flatData = (data?: any[]) => {
//     let list: any[] = []
//     if (data) {
//       for (const item of data) {
//         list = [...list, item]
//         if (item?.children?.length) {
//           list = [...list, ...flatData(item.children)]
//         }
//       }
//     }
//     return list
//   }
//   return flatData(tree)
// }

function compatibleRadioValue(key: string) {
  return gt(version, '2.6.0') ? { value: key } : { label: key }
}

const InnerSelectTable
  = defineComponent({
    name: 'FSelectTable',
    props: {
      columns: {
        type: Array as PropType<Column<any>[]>,
      },
      mode: {
        type: String as PropType<ISelectTableProps['mode']>,
        default: 'multiple',
      },
      optionAsValue: {
        type: Boolean,
        default: false,
      },
      valueType: {
        type: String as PropType<ISelectTableProps['valueType']>,
        default: 'all',
      },
      loading: {
        type: Boolean,
      },
      primaryKey: {
        type: [String, Function] as PropType<ISelectTableProps['primaryKey']>,
      },
      // filterOption: {
      //   type: Function as PropType<ISelectTableProps['filterOption']>,
      // },
      filterSort: {
        type: Function as PropType<ISelectTableProps['filterSort']>,
      },
      onSearch: {
        type: Function as PropType<ISelectTableProps['onSearch']>,
      },
      onChange: {
        type: Function as PropType<ISelectTableProps['onChange']>,
      },
      value: {
        type: [String, Number, Array] as PropType<ISelectTableProps['value']>,
      },
      rowKey: {
        type: [String, Function] as PropType<ISelectTableProps['rowKey']>,
      },
      dataSource: {
        type: Array as PropType<ISelectTableProps['dataSource']>,
      },
      clickRowToSelect: {
        type: Boolean,
        default: true,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const elTableRef = ref<TableInstance>()
      const rowKey = props.rowKey ?? props.primaryKey
      const selectedFlatDataSource = ref([])
      // 为了获取移除的项而缓存的当前页面的前一次选择
      let prevSelection = []

      const radioSelectedKey = ref()

      const columnSource = useSchemaColumns()
      const columns = props.columns ?? useColumns(columnSource)

      watch(() => props.dataSource, async () => {
        const selectedKeys = new Set(selectedFlatDataSource.value.map(item => isFn(rowKey) ? rowKey(item) : item[rowKey]))
        await nextTick()
        for (const item of props.dataSource) {
          if (selectedKeys.has(isFn(rowKey) ? rowKey(item) : item[rowKey])) {
            elTableRef.value.toggleRowSelection(item, true)
          }
        }
        await nextTick()
        prevSelection = elTableRef.value.getSelectionRows()
      })

      function onSelect(newSelection: Record<string, any>[]) {
        const rowKey = props.rowKey ?? props.primaryKey
        if (!rowKey) {
          throw new Error('rowKey is required')
        }

        if (props.mode === 'multiple') {
          const removedItemList = prevSelection.length > newSelection.length
            ? differenceWith(prevSelection, newSelection, (itemPrev, itemNext) => {
              return isFn(rowKey) ? rowKey(itemPrev) === rowKey(itemNext) : itemPrev[rowKey] === itemNext[rowKey]
            })
            : []
          prevSelection = newSelection
          selectedFlatDataSource.value = uniqWith([...selectedFlatDataSource.value, ...newSelection], (itemPrev, itemNext) => {
            return isFn(rowKey) ? rowKey(itemPrev) === rowKey(itemNext) : itemPrev[rowKey] === itemNext[rowKey]
          })
          if (removedItemList.length > 0) {
            const removedKeys = new Set(removedItemList.map(item => isFn(rowKey) ? rowKey(item) : item[rowKey]))
            remove(selectedFlatDataSource.value, item => removedKeys.has(isFn(rowKey) ? rowKey(item) : item[rowKey]))
          }

          if (props.optionAsValue) {
            emit('change', selectedFlatDataSource.value)
          }
          else {
            const selectedKeys = selectedFlatDataSource.value.map(item => isFn(rowKey) ? rowKey(item) : item[rowKey])
            emit('change', selectedKeys)
          }
        }
        // if (readPretty || disabled || readOnly || record?.disabled) {
        //   return
        // }
        // const selectedRowKey = props.primaryKey ? record?.[props.primaryKey] : null
        // const isSelected = selectedRowKey
        //   ? selected?.includes(selectedRowKey)
        //   : false
        // let selectedRowKeys: (string | null)[] = []
        // if (mode === 'single' && selectedRowKey) {
        //   selectedRowKeys = [selectedRowKey]
        // }
        // else {
        //   selectedRowKeys = isSelected ? selected.filter(item => item !== selectedRowKey) : [...selected, selectedRowKey]
        // }
        // if (rowSelection?.checkStrictly === false) {
        //   onSlacklyChange(selectedRowKeys)
        // }
        // else {
        //   onInnerChange(selectedRowKeys)
        // }
      }

      function onRowClick(row: Record<string, any>, _, event: Event) {
        if (props.clickRowToSelect) {
          if (props.mode === 'multiple') {
            const checkboxDOM = (event.target as Element).closest('tr').querySelector('input[type="checkbox"]')
            if (checkboxDOM instanceof HTMLElement) {
              checkboxDOM.click()
            }
          }
          else {
            const radioDOM = (event.target as Element).closest('tr').querySelector('input[type="radio"]')
            if (radioDOM instanceof HTMLElement) {
              radioDOM.click()
            }
          }
        }
      }

      return () => h(
        ElTable,
        {
          ref(ref) {
            elTableRef.value = ref as TableInstance
          },
          class: `${stylePrefix}-select-table`,
          ...props,
          rowClassName: props.clickRowToSelect ? `--click-row-select` : '',
          data: props.dataSource,
          type: 'selection',
          onSelect,
          onSelectAll: onSelect,
          onRowClick,
        },
        () => {
          return [props.mode === 'multiple'
            ? h(ElTableColumn, { type: 'selection' })
            : h(ElTableColumn, { type: 'radio', width: 46 }, {
              default({ row }) {
                const finalKey = isFn(rowKey) ? rowKey(row) : row[rowKey]
                return h(ElRadioGroup, { modelValue: radioSelectedKey.value }, {
                  default() {
                    return h(ElRadio, {
                      ...compatibleRadioValue(finalKey),
                      onChange: () => {
                        radioSelectedKey.value = finalKey
                        if (props.optionAsValue) {
                          emit('change', row)
                        }
                        else {
                          emit('change', finalKey)
                        }
                      },
                    }, () => '')
                  },
                })
              },
            }), columns.map((colItem) => {
            return h(ElTableColumn, { ...colItem })
          })]
        },
      )
    },
  })

const SelectTableInner = connect(InnerSelectTable, mapProps({ dataSource: 'dataSource' }))

const SelectTableColumn: Component = {
  name: 'FArrayTableColumn',
  render() {
    return null
  },
}

export const SelectTable = composeExport(SelectTableInner, {
  Column: SelectTableColumn,
})

export default SelectTable
