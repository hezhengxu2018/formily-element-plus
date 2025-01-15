import type { GeneralField } from '@formily/core'
import type { Schema, SchemaKey } from '@formily/json-schema'
import type { PropType } from 'vue'
import { model } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { toArr } from '@formily/shared'
import {
  Fragment,
  h,
  RecursionField,
  useField,
  useFieldSchema,
} from '@formily/vue'
import { ElBadge, ElCollapse, ElCollapseItem } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { composeExport, stylePrefix } from '../__builtins__'
import './style.scss'

type ActiveKeys = string | number | Array<string | number>

type ActiveKey = string | number

type Panels = { name: SchemaKey, props: any, schema: Schema }[]

export interface IFormCollapse {
  activeKeys: ActiveKeys
  hasActiveKey: (key: ActiveKey) => boolean
  setActiveKeys: (key: ActiveKeys) => void
  addActiveKey: (key: ActiveKey) => void
  removeActiveKey: (key: ActiveKey) => void
  toggleActiveKey: (key: ActiveKey) => void
}

export interface IFormCollapseProps {
  formCollapse?: IFormCollapse
  activeKey?: ActiveKey
}

function usePanels(collapseField: GeneralField, schema: Schema) {
  const panels: Panels = []
  schema.mapProperties((schema, name) => {
    const field = collapseField.query(collapseField.address.concat(name)).take()
    if (field?.display === 'none' || field?.display === 'hidden')
      return

    if (schema['x-component']?.indexOf('FormCollapse.Item') > -1) {
      panels.push({
        name,
        props: {
          ...schema?.['x-component-props'],
          key: schema?.['x-component-props']?.key || name,
        },
        schema,
      })
    }
  })
  return panels
}

function createFormCollapse(defaultActiveKeys?: ActiveKeys) {
  const formCollapse = model({
    activeKeys: defaultActiveKeys,
    setActiveKeys(keys: ActiveKeys) {
      formCollapse.activeKeys = keys
    },
    hasActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        if (formCollapse.activeKeys.includes(key)) {
          return true
        }
      }
      else if (formCollapse.activeKeys === key) {
        return true
      }
      return false
    },
    addActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key))
        return
      formCollapse.activeKeys = toArr(formCollapse.activeKeys).concat(key)
    },
    removeActiveKey(key: ActiveKey) {
      formCollapse.activeKeys = Array.isArray(formCollapse.activeKeys)
        ? formCollapse.activeKeys.filter(
            item => item !== key,
          )
        : ''
    },
    toggleActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) {
        formCollapse.removeActiveKey(key)
      }
      else {
        formCollapse.addActiveKey(key)
      }
    },
  })
  return formCollapse
}

const FormCollapse = observer(
  defineComponent({
    inheritAttrs: false,
    props: {
      formCollapse: { type: Object as PropType<IFormCollapse> },
      activeKey: {
        type: [String, Number],
      },
    },
    emits: ['input'],
    setup(props, { attrs, emit }) {
      const field = useField()
      const schema = useFieldSchema()
      const prefixCls = `${stylePrefix}-form-collapse`
      const formCollapseRef = computed(
        () => props.formCollapse ?? createFormCollapse(),
      )

      const takeActiveKeys = (panels: Panels) => {
        if (props.activeKey)
          return props.activeKey
        if (formCollapseRef.value?.activeKeys)
          return formCollapseRef.value?.activeKeys
        if (attrs.accordion)
          return panels[0]?.name
        return panels.map(item => item.name)
      }

      const badgedHeader = (key: SchemaKey, props: any, titleSlot) => {
        const errors = field.value.form.queryFeedbacks({
          type: 'error',
          address: `${field.value.address.concat(key)}.*`,
        })
        if (errors.length > 0) {
          return h(
            ElBadge,
            {
              class: [`${prefixCls}-errors-badge`],
              value: errors.length,
            },
            {
              default: () => {
                if (titleSlot) {
                  return h(Fragment, {}, titleSlot)
                }
                return props.title
              },
            },
          )
        }
        if (titleSlot) {
          return h(Fragment, {}, titleSlot)
        }
        return props.title
      }

      return () => {
        const panels = usePanels(field.value, schema.value)
        const activeKey = takeActiveKeys(panels)
        return h(
          ElCollapse,
          {
            class: prefixCls,
            modelValue: activeKey,
            onChange: (key: string | string[]) => {
              emit('input', key)
              formCollapseRef.value.setActiveKeys(key)
            },
          },
          {
            default: () => {
              return panels.map(({ props, schema, name }, key) => {
                const titleSlot = schema['x-content']?.title
                return h(
                  ElCollapseItem,
                  {
                    key,
                    ...props,
                    name,
                  },
                  {
                    default: () => h(RecursionField, { schema, name }, {}),
                    title: () =>
                      h(
                        Fragment,
                        {},
                        {
                          default: () => [badgedHeader(name, props, titleSlot)],
                        },
                      ),
                  },
                )
              })
            },
          },
        )
      }
    },
  }),
)

export const FormCollapseItem = defineComponent({
  name: 'FFormCollapseItem',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h(Fragment, {}, slots)
  },
})

const composeFormCollapse = composeExport(FormCollapse, {
  Item: FormCollapseItem,
  createFormCollapse,
})

export { composeFormCollapse as FormCollapse }
export default composeFormCollapse
