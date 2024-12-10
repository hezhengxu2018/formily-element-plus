import type { ArrayField } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import type { Ref } from 'vue'
import { reaction } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import {
  ElBadge,
  ElCard,
  ElEmpty,
  ElScrollbar,
} from 'element-plus'

import { defineComponent, h, inject, provide, ref } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { composeExport } from '../__builtins__/shared'
import { ArrayBase } from '../array-base'

function isAdditionComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Addition') > -1
}
function isRemoveComponent(schema: ISchema) {
  return schema['x-component']?.indexOf('Remove') > -1
}

const prefixCls = `${stylePrefix}-array-list-tabs`
const tabsRootContextKey = Symbol('tabsRootContextKey')

const ArrayListTabPane = defineComponent({
  name: 'ArrayListTabPane',
  props: {
    index: {
      type: Number,
    },
  },
  setup(props, { slots }) {
    const activeIndex = inject<Ref>(tabsRootContextKey)
    return () =>
      h(
        'div',
        {
          'class': `${prefixCls}-tabpane`,
          'style': activeIndex.value !== props.index && 'display: none;',
          'role': 'tabpanel',
          'aria-labelledby': `tab-${props.index}`,
        },
        slots.default(),
      )
  },
})

export const ArrayListTabsInner = observer(
  defineComponent({
    name: 'FArrayListTabs',
    props: {
      tabTitleField: {
        type: String,
      },
      value: {
        type: Array,
        default: () => [],
      },
    },
    setup(props, { attrs }) {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()
      const activeIndex = ref(0)
      const { getKey, keyMap } = ArrayBase.useKey(schemaRef.value)
      provide(tabsRootContextKey, activeIndex)
      const field = fieldRef.value
      const schema = schemaRef.value
      const dataSource = field.value
      if (!schema)
        throw new Error('can not found schema object')
      reaction(() => {
        if (field.value.length > 0 && activeIndex.value >= field.value.length) {
          activeIndex.value = field.value.length - 1
        }
      })

      function onTabClick(index) {
        activeIndex.value = index
      }

      const badgedTab = (item, index: number) => {
        const tab = `${item?.[props.tabTitleField] || '未命名条目'}`
        const path = field.address.concat(index)
        const errors = field.form.queryFeedbacks({
          type: 'error',
          address: `${path}.**`,
        })
        if (errors.length > 0) {
          return h(
            ElBadge,
            {
              class: [`${prefixCls}-errors-badge`],
              value: errors.length,
              offset: [5, -2],
            },
            {
              default: () => [
                h(
                  'span',
                  {
                    class: `${prefixCls}_list-item--title`,
                  },
                  {
                    default: () => [tab],
                  },
                ),
              ],
            },
          )
        }
        return h(
          'span',
          {
            class: `${prefixCls}_list-item--title`,
          },
          {
            default: () => [tab],
          },
        )
      }

      const renderItems = () => {
        return dataSource?.map((item, index) => {
          const key = getKey(item, index)
          return h(
            ArrayBase.Item,
            {
              key,
              index,
              record: item,
            },
            {
              default: () =>
                h(
                  ArrayListTabPane,
                  {
                    key,
                    index,
                  },
                  () =>
                    h(RecursionField, {
                      schema: schema.items,
                      name: index,
                      filterProperties: (schema: ISchema) => {
                        if (isRemoveComponent(schema))
                          return false
                        return true
                      },
                      onlyRenderProperties: true,
                    }),
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
            class: `${prefixCls}-item`,
            shadow: 'never',
            ...attrs,
            header: attrs.title || field.title,
          },
          {
            default: () =>
              h(ElEmpty, { description: 'No Data', imageSize: 100 }, {}),
          },
        )
      }

      const renderList = () => {
        return h(
          'ul',
          { class: `${prefixCls}_list` },
          {
            default: () => [
              h(
                ElScrollbar,
                { class: `${prefixCls}_list--scroll-wrapper` },
                {
                  default: () =>
                    dataSource?.map((item, index) => {
                      const key = getKey(item, index)
                      return h(
                        ArrayBase.Item,
                        {
                          key,
                          index,
                          record: item,
                        },
                        {
                          default: () => {
                            return h(
                              'li',
                              {
                                class: [
                                  `${prefixCls}_list-item`,
                                  activeIndex.value === index && 'is-active',
                                ],
                                onClick: () => onTabClick(index),
                              },
                              {
                                default: () => [
                                  h(
                                    'div',
                                    {
                                      class: `${prefixCls}_list-item--content`,
                                    },
                                    {
                                      default: () => [badgedTab(item, index)],
                                    },
                                  ),
                                  // render remove icon
                                  h(RecursionField, {
                                    schema: schema.items,
                                    name: index,
                                    filterProperties: (schema: ISchema) => {
                                      if (isRemoveComponent(schema))
                                        return true
                                      return false
                                    },
                                    onlyRenderProperties: true,
                                  }),
                                ],
                              },
                            )
                          },
                        },
                      )
                    }),
                },
              ),
              renderAddition(),
            ],
          },
        )
      }
      return () => {
        return h(
          'div',
          {
            class: prefixCls,
          },
          h(
            ArrayBase,
            {
              keyMap,
            },
            {
              default: () => [renderList(), renderEmpty(), renderItems()],
            },
          ),
        )
      }
    },
  }),
)

export const ArrayListTabs = composeExport(ArrayListTabsInner, {
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
})

export default ArrayListTabs
