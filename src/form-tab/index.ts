import type { Schema, SchemaKey } from '@formily/json-schema'
import type { PropType } from 'vue'
import { model } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import {
  RecursionField,
  useField,
  useFieldSchema,
} from '@formily/vue'
import { ElBadge, ElTabPane, ElTabs } from 'element-plus'
import { computed, defineComponent, Fragment, h, reactive } from 'vue'
import { composeExport, stylePrefix } from '../__builtins__'
import './style.scss'

export interface IFormTab {
  activeKey: string
  setActiveKey: (key: string) => void
}

export interface IFormTabProps {
  formTab?: IFormTab
}

export interface IFormTabPaneProps {
  key: string | number
}

type Tabs = { name: SchemaKey, props: any, schema: Schema }[]

function useTabs() {
  const tabsField = useField()
  const schema = useFieldSchema()
  const tabs: Tabs = reactive([])
  schema.value.mapProperties((schema, name) => {
    const field = tabsField.value
      .query(tabsField.value.address.concat(name))
      .take()
    if (field?.display === 'none' || field?.display === 'hidden')
      return

    if (schema['x-component']?.indexOf('TabPane') > -1) {
      tabs.push({
        name,
        props: {
          name: schema?.['x-component-props']?.name || name,
          ...schema?.['x-component-props'],
        },
        schema,
      })
    }
  })
  return tabs
}

function createFormTab(defaultActiveKey?: string) {
  const formTab = model({
    activeKey: defaultActiveKey,
    setActiveKey(key: string) {
      formTab.activeKey = key
    },
  })
  return formTab
}

const FormTab = observer(
  defineComponent({
    inheritAttrs: false,
    props: {
      formTab: { type: Object as PropType<IFormTab> },
      value: {
        type: String,
      },
    },
    emits: ['input'],
    setup(props, { attrs, emit }: any) {
      const field = useField()
      const prefixCls = `${stylePrefix}-form-tab`
      const formTabRef = computed(() => props.formTab ?? createFormTab())

      const takeActiveKey = (tabs: Tabs) => {
        return props?.value || formTabRef.value?.activeKey || tabs?.[0]?.name
      }

      const badgedHeader = (key: SchemaKey, props: any) => {
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
            { default: () => props.label },
          )
        }
        return props.label
      }

      return () => {
        const tabs = useTabs()
        const activeKey = takeActiveKey(tabs)

        return h(
          ElTabs,
          {
            ...attrs,
            class: [prefixCls],
            modelValue: activeKey,
            onTabChange: (key: string) => {
              if (typeof key !== 'string')
                return

              emit('input', key)
              formTabRef.value.setActiveKey?.(key)
            },
          },
          {
            default: () =>
              tabs.map(({ props, schema, name }, key) => {
                return h(
                  ElTabPane,
                  {
                    key,
                    ...props,
                  },
                  {
                    default: () => h(RecursionField, { schema, name }, {}),
                    label: () =>
                      h(
                        'div',
                        {},
                        { default: () => [badgedHeader(name, props)] },
                      ),
                  },
                )
              }),
          },
        )
      }
    },
  }),
)

const FormTabPane = defineComponent<IFormTabPaneProps>({
  name: 'FFormTabPane',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h(Fragment, slots.default?.())
  },
})

export const composeFormTab = composeExport(FormTab, {
  TabPane: FormTabPane,
  createFormTab,
})

export { composeFormTab as FormTab }
export default composeFormTab
