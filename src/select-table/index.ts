import { defineComponent, h } from 'vue'
import { useField, useFieldSchema } from '@formily/vue'
import { ElTable, ElTableColumn } from 'element-plus'
import type { Schema } from '@formily/vue'
import type { ArrayField, FieldDisplayTypes, GeneralField } from '@formily/core'
import type { Column, TableProps } from 'element-plus'
import { isArr } from '@formily/shared'

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
  filterOption?: IFilterOption
  filterSort?: IFilterSort
  onSearch?: (keyword: string) => void
  onChange?: (value: any, options: any) => void
  value?: any
}

// interface ObservableColumnSource {
//   field?: GeneralField
//   columnProps: Column<any>
//   schema: Schema
//   display: FieldDisplayTypes
//   name: string
// }

// function isColumnComponent(schema: Schema) {
//   return schema['x-component']?.indexOf('Column') > -1
// }

// function useSources() {
//   const arrayField = useField<ArrayField>()
//   const schema = useFieldSchema()
//   const parseSources = (schema: Schema): ObservableColumnSource[] => {
//     if (isColumnComponent(schema)) {
//       if (!schema['x-component-props']?.dataIndex && !schema.name)
//         return []
//       const name = schema['x-component-props']?.dataIndex || schema.name
//       const field = arrayField.value.query(arrayField.value.address.concat(name)).take()
//       const columnProps
//         = field?.component?.[1] || schema['x-component-props'] || {}
//       const display = field?.display || schema['x-display']
//       return [
//         {
//           name,
//           display,
//           field,
//           schema,
//           columnProps: {
//             title: field?.title || columnProps.title,
//             ...columnProps,
//           },
//         },
//       ]
//     }
//     else if (schema.properties) {
//       return schema.reduceProperties<
//         ObservableColumnSource[],
//         ObservableColumnSource[]
//       >((buf, schema) => {
//         return buf.concat(parseSources(schema))
//       }, [])
//     }
//     return []
//   }

//   const parseArrayItems = (schema: Schema['items']) => {
//     if (!schema)
//       return []
//     const sources: ObservableColumnSource[] = []
//     const items = isArr(schema) ? schema : [schema]
//     return items.reduce((columns, schema) => {
//       const item = parseSources(schema)
//       if (item) {
//         return columns.concat(item)
//       }
//       return columns
//     }, sources)
//   }

//   const validSchema = (
//     schema.value?.type === 'array' && schema.value?.items ? schema.value.items : schema
//   ) as Schema

//   return parseArrayItems(validSchema)
// }

const InnerSelectTable = defineComponent({
  name: 'FSelectTable',
  props: ['columns', 'data'],
  setup(props) {
    // const sources = useSources()
    const field = useField<ArrayField>()
    const dataSource = isArr(props.data) ? props.data : field.value.dataSource
    return () =>
      h(
        ElTable,
        {
          data: dataSource,
        },
        props.columns.map((colItem) => {
          return h(ElTableColumn, { ...colItem })
        }),
      )
  },
})

export default InnerSelectTable
