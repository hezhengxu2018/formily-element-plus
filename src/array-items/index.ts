import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import { observer } from '@formily/reactive-vue'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { defineComponent, h } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { stylePrefix } from '../__builtins__/configs'
import { composeExport } from '../__builtins__/shared'
import { ArrayBase } from '../array-base'
import './style.scss'

function isAdditionComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Addition') > -1
}

export interface IArrayItemsItemProps {
  type?: 'card' | 'divide'
}

const ArrayItemsInner = observer(
  defineComponent({
    name: 'FArrayItems',
    inheritAttrs: false,
    setup() {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()

      const prefixCls = `${stylePrefix}-array-items`
      const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)

      return () => {
        const field = fieldRef.value
        const schema = schemaRef.value
        const dataSource = Array.isArray(field.value) ? [...field.value] : []

        const renderItems = () => {
          const itemSlot = ({
            element,
            index,
          }: {
            element: any
            index: number
          }) => {
            const items = Array.isArray(schema.items)
              ? schema.items[index] || schema.items[0]
              : schema.items
            const key = getKey(element, index)
            return h(
              'div',
              {},
              h(
                ArrayBase.Item,
                {
                  key,
                  index,
                  record: element,
                },
                {
                  default: () =>
                    h(
                      'div',
                      {
                        class: [`${prefixCls}-item-inner`],
                        index,
                        key,
                      },
                      h(RecursionField, {
                        schema: items,
                        name: index,
                      }),
                    ),
                },
              ),
            )
          }

          return h(
            VueDraggable,
            {
              class: [`${prefixCls}-list`],
              modelValue: dataSource,
              handle: `.${stylePrefix}-array-base-sort-handle`,
              animation: 150,
              onEnd(evt) {
                const { oldIndex, newIndex } = evt
                if (Array.isArray(keyMap)) {
                  keyMap.splice(newIndex, 0, keyMap.splice(oldIndex, 1)[0])
                }
                field.move(oldIndex, newIndex)
              },
            },
            { default: () => dataSource
              .map((element, index) => {
                return itemSlot({ element, index })
              }),
            },
          )
        }
        const renderAddition = () => {
          return schema.reduceProperties((addition, schema) => {
            if (isAdditionComponent(schema)) {
              return h(RecursionField, {
                schema,
                name: 'addition',
              })
            }
            return addition
          }, null)
        }

        return h(
          ArrayBase,
          {
            keyMap,
          },
          {
            default: () =>
              h(
                'div',
                {
                  class: [prefixCls],
                  onChange: () => {},
                },
                {
                  default: () => [renderItems(), renderAddition()],
                },
              ),
          },
        )
      }
    },
  }),
)

const ArrayItemsItem = defineComponent({
  name: 'FArrayItemsItem',
  props: ['type'],
  setup(props, { attrs, slots }) {
    const prefixCls = `${stylePrefix}-array-items`

    return () =>
      h(
        'div',
        {
          class: [`${prefixCls}-${props.type || 'card'}`],
          ...attrs,
          onChange: () => {},
        },
        slots,
      )
  },
})

export const ArrayItems = composeExport(ArrayItemsInner, {
  Item: ArrayItemsItem,
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

export default ArrayItems
