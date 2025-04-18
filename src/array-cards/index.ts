import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import { observer } from '@formily/reactive-vue'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElCard, ElEmpty, ElRow } from 'element-plus'
import { defineComponent, h } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { composeExport } from '../__builtins__/shared'
import { ArrayBase } from '../array-base'
import './style.scss'

function isAdditionComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Addition') > -1
}

function isIndexComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Index') > -1
}

function isRemoveComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Remove') > -1
}

function isMoveUpComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('MoveUp') > -1
}

function isMoveDownComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('MoveDown') > -1
}

function isOperationComponent(schema: ISchema) {
  return (
    isAdditionComponent(schema)
    || isRemoveComponent(schema)
    || isMoveDownComponent(schema)
    || isMoveUpComponent(schema)
  )
}
const ArrayCardsInner = observer(
  defineComponent({
    name: 'FArrayCards',
    inheritAttrs: false,
    props: ['onChange'],
    setup(props, { attrs }) {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()
      const prefixCls = `${stylePrefix}-array-cards`
      const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

      return () => {
        const field = fieldRef.value
        const schema = schemaRef.value
        const dataSource = Array.isArray(field.value) ? field.value : []
        if (!schema)
          throw new Error('can not found schema object')

        const renderItems = () => {
          return dataSource?.map((item, index) => {
            const items = Array.isArray(schema.items)
              ? schema.items[index] || schema.items[0]
              : schema.items

            const title = h(
              'span',
              {},
              {
                default: () => [
                  h(
                    RecursionField,
                    {
                      schema: items,
                      name: index,
                      filterProperties: (schema: ISchema) => {
                        if (!isIndexComponent(schema))
                          return false
                        return true
                      },
                      onlyRenderProperties: true,
                    },
                    {},
                  ),
                  attrs.title || field.title,
                ],
              },
            )
            const extra = h(
              'span',
              {
                class: `${prefixCls}-extra-container`,
              },
              {
                default: () => [
                  h(
                    RecursionField,
                    {
                      schema: items,
                      name: index,
                      filterProperties: (schema: ISchema) => {
                        if (!isOperationComponent(schema))
                          return false
                        return true
                      },
                      onlyRenderProperties: true,
                    },
                    {},
                  ),
                  attrs.extra,
                ],
              },
            )
            const content = h(
              RecursionField,
              {
                schema: items,
                name: index,
                filterProperties: (schema: ISchema) => {
                  if (isIndexComponent(schema))
                    return false
                  if (isOperationComponent(schema))
                    return false
                  return true
                },
              },
              {},
            )
            return h(
              ArrayBase.Item,
              {
                key: getKey(item, index),
                index,
                record: item,
              },
              {
                default: () =>
                  h(
                    ElCard,
                    {
                      shadow: 'never',
                      ...attrs,
                      class: [`${prefixCls}-item`].concat((attrs as any).class),
                    },
                    {
                      default: () => [content],
                      header: () =>
                        h(
                          ElRow,
                          {
                            type: 'flex',
                            justify: 'space-between',
                          },
                          {
                            default: () => [title, extra],
                          },
                        ),
                    },
                  ),
              },
            )
          })
        }
        const renderAddition = () => {
          return schema.reduceProperties((addition, schema) => {
            if (isAdditionComponent(schema)) {
              return h(
                RecursionField,
                {
                  schema,
                  name: 'addition',
                },
                {},
              )
            }
            return addition
          }, null)
        }
        const renderEmpty = () => {
          if (dataSource?.length)
            return
          return h(
            ElCard,
            {
              class: [`${prefixCls}-item`],
              shadow: 'never',
              ...attrs,
              header: attrs.title || field.title,
            },
            {
              default: () =>
                h(
                  ElEmpty,
                  { props: { description: 'No Data', imageSize: 100 } },
                  {},
                ),
            },
          )
        }

        return h(
          'div',
          {
            class: [prefixCls],
          },
          h(
            ArrayBase,
            {
              keyMap,
            },
            {
              default: () => {
                return [renderEmpty(), renderItems(), renderAddition()]
              },
            },
          ),
        )
      }
    },
  }),
)

export const ArrayCards = composeExport(ArrayCardsInner, {
  Index: ArrayBase.Index,
  SortHandle: ArrayBase.SortHandle,
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
  MoveDown: ArrayBase.MoveDown,
  MoveUp: ArrayBase.MoveUp,
  useArray: ArrayBase.useArray,
  useIndex: ArrayBase.useIndex,
  useRecord: ArrayBase.useRecord,
})

export default ArrayCards
