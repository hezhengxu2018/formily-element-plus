import { createForm } from '@formily/core'
import { ElTableColumn } from 'element-plus'
import { FormProvider, createSchemaField } from '@formily/vue'
import { FormItem } from '../../index'
import SelectTable from '../index'

const { SchemaField, SchemaObjectField, SchemaVoidField, SchemaArrayField } = createSchemaField({
  components: {
    FormItem,
    SelectTable,
    ElTableColumn,
  },
})

const form = createForm()

function markupSchema() {
  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaArrayField
          type="array"
          name="selectTable"
          x-decorator="FormItem"
          x-component="SelectTable"
          x-component-props={{
            bordered: false,
            primaryKey: 'key',
          }}
          enum={[
            { key: '1', name: 'title-1', description: 'description-1' },
            { key: '2', name: 'title-2', description: 'description-2' },
          ]}
        >
          <SchemaObjectField>
            <SchemaVoidField
              name="name"
              title="Title"
              x-component="SelectTable.Column"
              x-component-props={{
                label: 'Title',
              }}
            />
            <SchemaVoidField
              name="description"
              title="Description"
              x-component="SelectTable.Column"
              x-component-props={{
                label: 'Description',
              }}
            />
          </SchemaObjectField>
        </SchemaArrayField>
      </SchemaField>
    </FormProvider>
  )
}
// function markupSchema() {
//   return {
//     FormProvider: {
//       form,
//       children: (
//         h(SchemaField, null, [
//           h(SchemaObjectField, {
//             type: 'string',
//             name: 'selectTable',
//             xDecorator: 'FormItem',
//             xComponent: 'SelectTable',
//             xComponentProps: {
//               bordered: false,
//               mode: 'single',
//             },
//             enum: [
//               { key: '1', name: '标题1', description: '描述1' },
//               { key: '2', name: '标题2', description: '描述2' },
//             ],
//           }, [
//             h(SchemaFieldVoid, {
//               name: 'name',
//               title: '标题',
//               xComponent: 'SelectTable.Column',
//             }),
//             h(SchemaFieldVoid, {
//               name: 'description',
//               title: '描述',
//               xComponent: 'SelectTable.Column',
//             }),
//           ]),
//         ]),
//       ),
//     },
//     FormButtonGroupFormItem: {
//       children: (
//         h(FormButtonGroup.FormItem, null, [
//           h(Submit, {
//             onSubmit: console.log,
//           }, '提交'),
//         ]),
//       ),
//     },
//   };
// }
export default markupSchema
