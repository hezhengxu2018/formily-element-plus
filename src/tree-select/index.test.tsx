import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import TreeSelect from './index'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-tree-select.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-tree.css'

const sourceData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

function formilyWrapperFactory(fieldProps = {}, treeSelectProps = {}) {
  return defineComponent({
    props: {
      form: {
        type: Object,
        default: () => createForm(),
      },
    },
    setup(props) {
      return () => (
        <FormProvider form={props.form}>
          <Field
            name="treeSelect"
            title="treeSelect"
            dataSource={sourceData}
            {...fieldProps}
            component={[
              TreeSelect,
              {
                ...treeSelectProps,
              },
            ]}
          />
        </FormProvider>
      )
    },
  })
}

describe.skip('基础数据展示', async () => {
  it('应该显示dataSource内的值', async () => {
    const screen = render(formilyWrapperFactory())
    await screen.getByText('Select').click()
    await expect.element(screen.getByText('Level one 1')).toBeInTheDocument()
  })
})
