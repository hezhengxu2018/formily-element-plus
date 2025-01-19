import type { FieldDisplayTypes, GeneralField } from '@formily/core'
import type { Schema } from '@formily/vue'
import type { Column, TableInstance, TableProps } from 'element-plus'
import type { Component, PropType } from 'vue'
import { isEqual, isFn } from '@formily/shared'
import { connect, mapProps, useFieldSchema } from '@formily/vue'
import {
  ElLink,
  ElRadio,
  ElRadioGroup,
  ElTable,
  ElTableColumn,
  version,
  vLoading,
} from 'element-plus'
import { differenceWith, isNil, remove, uniqWith } from 'lodash-es'
import { gt } from 'semver'
import { computed, defineComponent, h, mergeProps, nextTick, ref, watch, withDirectives } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { composeExport } from '../__builtins__/shared'
import './style'

type IFilterOption = boolean | ((option: any, keyword: string) => boolean)

type IFilterSort = (optionA: any, optionB: any) => number

export interface ISelectTableProps extends TableProps<any> {
  mode?: 'multiple' | 'single'
  dataSource?: any[]
  optionAsValue?: boolean
  valueType?: 'all' | 'parent' | 'child' | 'path'
  primaryKey?: string
  rowKey?: string
  filterOption?: IFilterOption
  filterSort?: IFilterSort
  onSearch?: (keyword: string) => void
  onChange?: (value: any, options: any) => void
  value?: any
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

const InnerSelectTable = defineComponent({
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
    primaryKey: {
      type: String as PropType<ISelectTableProps['primaryKey']>,
    },
    onSearch: {
      type: Function as PropType<ISelectTableProps['onSearch']>,
    },
    value: {
      type: [String, Number, Array, Object] as PropType<
        ISelectTableProps['value']
      >,
    },
    rowKey: {
      type: String as PropType<ISelectTableProps['rowKey']>,
    },
    dataSource: {
      type: Array as PropType<ISelectTableProps['dataSource']>,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    clickRowToSelect: {
      type: Boolean,
      default: true,
    },
    showAlertToolbar: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs, slots }) {
    const elTableRef = ref<TableInstance>()
    const rowKey = props.rowKey ?? props.primaryKey
    function getRowKey(item: unknown) {
      return isFn(rowKey) ? rowKey(item) : item[rowKey]
    }
    const selectedFlatDataSource = ref([])
    // 为了获取移除的项而缓存的当前页面的前一次选择
    let prevSelection = []

    const radioSelectedKey = ref()
    const columns = props.columns ?? []

    const currentSelectLength = computed(() => {
      if (props.mode === 'multiple') {
        return Array.isArray(props.value) ? props.value.length : 0
      }
      else {
        return isNil(radioSelectedKey.value) ? 0 : 1
      }
    })

    // 当前页面是否是树形表格
    // const isTree = computed(() => {
    //   const treeProps = attrs.treeProps as TreeProps
    //   if (treeProps?.children) {
    //     return props.dataSource.some(item => item[treeProps.children])
    //   }
    //   return props.dataSource.some(item => item.children)
    // })

    watch(
      () => props.dataSource,
      async () => {
        if (isNil(props.dataSource)) {
          return
        }
        const selectedKeys = new Set(
          selectedFlatDataSource.value.map(item => getRowKey(item)),
        )
        await nextTick()
        for (const item of props.dataSource) {
          if (selectedKeys.has(getRowKey(item))) {
            if (props.mode === 'multiple') {
              elTableRef.value.toggleRowSelection(item, true)
            }
            else {
              elTableRef.value.setCurrentRow(item)
              onRadioClick(item)
            }
          }
          await nextTick()
          prevSelection = elTableRef.value.getSelectionRows()
        }
      },
      { immediate: true },
    )

    watch(() => props.value, async (value) => {
      if (props.mode === 'single') {
        const valueKey = props.optionAsValue ? value[rowKey] : value
        radioSelectedKey.value = valueKey
      }
      else {
        const currentDisplayDataKeys = props.optionAsValue ? selectedFlatDataSource.value : selectedFlatDataSource.value.map(item => item[rowKey])
        const valueKeys = props.optionAsValue ? value.map(item => item[rowKey]) : value ?? []
        if (isEqual(valueKeys, currentDisplayDataKeys)) {
          return
        }
        if (valueKeys.length > currentDisplayDataKeys.length) {
          const shouldSelectItem = differenceWith(
            valueKeys,
            currentDisplayDataKeys,
            (itemPrev, itemNext) => {
              return itemPrev === itemNext
            },
          )
          await nextTick()
          for (const tableItem of props.dataSource) {
            for (const i of shouldSelectItem) {
              if (tableItem[rowKey] === i) {
                elTableRef.value.toggleRowSelection(tableItem, true)
              }
            }
          }
        }
        else {
          const shouldRemoveItem = differenceWith(
            valueKeys,
            currentDisplayDataKeys,
            (itemPrev, itemNext) => {
              return itemPrev === itemNext
            },
          )
          await nextTick()
          for (const tableItem of props.dataSource) {
            for (const i of shouldRemoveItem) {
              if (tableItem[rowKey] === i) {
                elTableRef.value.toggleRowSelection(tableItem, false)
              }
            }
          }
        }
      }
    }, {
      immediate: true,
    })

    function onSelect(newSelection: Record<string, any>[]) {
      const removedItemList
        = prevSelection.length > newSelection.length
          ? differenceWith(
              prevSelection,
              newSelection,
              (itemPrev, itemNext) => {
                return !isFn(rowKey) && itemPrev[rowKey] === itemNext[rowKey]
              },
            )
          : []
      prevSelection = [...newSelection]
      selectedFlatDataSource.value = uniqWith(
        [...selectedFlatDataSource.value, ...newSelection],
        (itemPrev, itemNext) => {
          return isFn(rowKey)
            ? rowKey(itemPrev) === rowKey(itemNext)
            : itemPrev[rowKey] === itemNext[rowKey]
        },
      )
      if (removedItemList.length > 0) {
        const removedKeys = new Set(
          removedItemList.map(item => getRowKey(item)),
        )
        remove(selectedFlatDataSource.value, item =>
          removedKeys.has(isFn(rowKey) ? rowKey(item) : item[rowKey]))
      }

      if (props.optionAsValue) {
        emit('change', selectedFlatDataSource.value)
      }
      else {
        const selectedKeys = selectedFlatDataSource.value.map(item =>
          isFn(rowKey) ? rowKey(item) : item[rowKey],
        )
        emit('change', selectedKeys)
      }
    }

    function onRadioClick(row) {
      const finalKey = getRowKey(row)
      radioSelectedKey.value = finalKey
      if (props.optionAsValue) {
        emit('change', row)
      }
      else {
        emit('change', finalKey)
      }
    }

    function onRowClick(row: Record<string, any>, _, event: Event) {
      if (!props.clickRowToSelect)
        return

      if (props.mode === 'multiple') {
        const checkboxDOM = (event.target as Element)
          .closest('tr')
          .querySelector('input[type="checkbox"]')
        if (checkboxDOM instanceof HTMLElement) {
          checkboxDOM.click()
        }
      }
      else {
        const radioDOM = (event.target as Element)
          .closest('tr')
          .querySelector('input[type="radio"]')
        if (radioDOM instanceof HTMLElement) {
          radioDOM.click()
        }
      }
    }

    function onClearSelectionClick() {
      if (props.mode === 'multiple') {
        elTableRef.value.clearSelection()
        emit('change', [])
        selectedFlatDataSource.value = []
      }
      else {
        radioSelectedKey.value = null
        emit('change', null)
      }
    }

    return () => {
      const elTableDefaultProps = {
        ref(ref) {
          elTableRef.value = ref as TableInstance
        },
        rowKey,
        rowClassName: props.clickRowToSelect ? `--click-row-select` : '',
        data: props.dataSource,
        onSelect,
        onSelectAll: onSelect,
        onRowClick,
      }

      return h('div', { class: `${stylePrefix}-select-table` }, [
        currentSelectLength.value > 0
        && props.showAlertToolbar
        && h('div', { class: `${stylePrefix}-select-table-alert-container` }, [
          h(
            'span',
            `已选择 ${currentSelectLength.value} 项 `,
          ),
          h(
            ElLink,
            {
              type: 'primary',
              underline: false,
              style: 'margin-left: 8px;',
              onClick: onClearSelectionClick,
            },
            () => '取消选择',
          ),
        ]),
        withDirectives(
          h(
            ElTable,
            mergeProps(elTableDefaultProps, attrs),
            () => {
              return [
                props.mode === 'multiple'
                  ? h(ElTableColumn, { type: 'selection' })
                  : h(
                      ElTableColumn,
                      { type: 'radio', width: 46 },
                      {
                        default({ row }) {
                          const finalKey = getRowKey(row)
                          return h(
                            ElRadioGroup,
                            { modelValue: radioSelectedKey.value },
                            {
                              default() {
                                return h(
                                  ElRadio,
                                  {
                                    ...compatibleRadioValue(finalKey),
                                    onChange: () => onRadioClick(row),
                                  },
                                  () => '',
                                )
                              },
                            },
                          )
                        },
                      },
                    ),
                columns.length === 0
                  ? slots?.default?.()
                  : columns.map((colItem) => {
                      return h(ElTableColumn, { ...colItem })
                    }),
              ]
            },
          ),
          [[vLoading, props.loading]],
        ),
      ])
    }
  },
})

const SelectTableInner = connect(
  InnerSelectTable,
  mapProps({ dataSource: 'dataSource', loading: 'loading' }),
)

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
