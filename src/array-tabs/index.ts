import { defineComponent, h, ref } from 'vue'
import { observer } from '@formily/reactive-vue'
import type { ArrayField } from '@formily/core'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElBadge, ElTabPane, ElTabs } from 'element-plus'
import { isFn } from '@formily/shared'
import { stylePrefix } from '../__builtins__/configs'

export const ArrayTabs = observer(
  defineComponent({
    name: 'ArrayTabs',
    props: ['onChange'],
    setup(props, { attrs }) {
      const fieldRef = useField<ArrayField>()
      const schemaRef = useFieldSchema()

      const prefixCls = `${stylePrefix}-array-tabs`
      const activeKey = ref('tab-0')

      return () => {
        const field = fieldRef.value
        const schema = schemaRef.value
        const value = Array.isArray(field.value) ? field.value : []
        const dataSource = value?.length ? value : [{}]

        const onEdit = (targetKey: any, type: 'add' | 'remove') => {
          if (type === 'add') {
            const id = dataSource.length
            if (field?.value?.length) {
              field.push(null)
            }
            else {
              field.push(null, null)
            }
            activeKey.value = `tab-${id}`
          }
          else if (type === 'remove') {
            const index = targetKey.match(/-(\d+)/)?.[1]
            field.remove(Number(index))
            if (activeKey.value === targetKey) {
              activeKey.value = `tab-${index - 1}`
            }
          }
        }

        const badgedTab = (index: number) => {
          const tab = `${field.title || 'Untitled'} ${index + 1}`
          const path = field.address.concat(index)
          const errors = field.form.queryFeedbacks({
            type: 'error',
            address: `${path}.**`,
          })
          if (errors.length > 0) {
            return h(
              'span',
              {},
              {
                default: () => [
                  h(
                    ElBadge,
                    {
                      class: [`${prefixCls}-errors-badge`],
                      value: errors.length,
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
            {},
            {
              default: () => [tab],
            },
          )
        }

        const renderItems = () =>
          dataSource?.map((item, index) => {
            const items = Array.isArray(schema.items)
              ? schema.items[index]
              : schema.items
            const key = `tab-${index}`

            return h(
              ElTabPane,
              {
                key,
                closable: index !== 0,
                name: key,
              },
              {
                default: () =>
                  h(
                    RecursionField,
                    {
                      schema: items,
                      name: index,
                    },
                    {},
                  ),

                label: () => [badgedTab(index)],
              },
            )
          })
        return h(
          ElTabs,
          {
            'class': [prefixCls],
            ...attrs,
            'type': 'card',
            'modelValue': activeKey.value,
            'addable': true,
            'onUpdata:modelValue': (key: any) => {
              activeKey.value = key
            },
            'onTabRemove': (target: any) => {
              onEdit(target, 'remove')
              if (isFn(attrs['tab-remove'])) {
                attrs['tab-remove'](target)
              }
            },
            'onTabAdd': () => {
              onEdit(null, 'add')
              if (isFn(attrs['tab-add'])) {
                attrs['tab-add']()
              }
            },
            'onChange': () => {},
          },
          {
            default: () => [renderItems()],
          },
        )
      }
    },
  }),
)

export default ArrayTabs
