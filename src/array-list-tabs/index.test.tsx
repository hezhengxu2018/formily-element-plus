/*
 * @Author: Hezhengxu
 * @Date: 2024-11-19 09:52:46
 * @LastEditors: Hezhengxu
 * @Description:
 */
import { Close } from '@element-plus/icons-vue'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import { ArrayListTabs, FormItem, Input } from '../index'
import './style.scss'
import 'element-plus/theme-chalk/src/input.scss'
import 'element-plus/theme-chalk/src/base.scss'
import 'element-plus/theme-chalk/src/empty.scss'
import 'element-plus/theme-chalk/src/link.scss'
import 'element-plus/theme-chalk/src/icon.scss'
import 'element-plus/theme-chalk/src/badge.scss'
import 'element-plus/theme-chalk/src/scrollbar.scss'

export const ArrayListTabsTest = defineComponent({
  name: 'TestComponent',
  setup(_props) {
    const {
      SchemaField,
      SchemaArrayField,
      SchemaObjectField,
      SchemaStringField,
      SchemaVoidField,
    } = createSchemaField({
      components: {
        FormItem,
        Input,
        ArrayListTabs,
      },
    })
    const form = createForm()

    return () => (
      <FormProvider form={form}>
        <SchemaField>
          <SchemaArrayField
            name="array"
            x-decorator="FormItem"
            x-component="ArrayListTabs"
            x-component-props={{
              tabTitleField: 'input',
            }}
            x-validator={{
              max: 5,
            }}
          >
            <SchemaObjectField>
              <SchemaStringField
                name="input"
                x-decorator="FormItem"
                title="input"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入Input',
                }}
                x-validator={[{ required: true }]}
              />
              <SchemaStringField
                name="input2"
                x-decorator="FormItem"
                title="input2"
                x-component="Input"
              />
              <SchemaVoidField
                x-component="ArrayListTabs.Remove"
                x-component-props={{
                  icon: Close,
                }}
              />
            </SchemaObjectField>
            <SchemaVoidField
              x-component="ArrayListTabs.Addition"
              title="添加条目"
            />
          </SchemaArrayField>
        </SchemaField>
      </FormProvider>
    )
  },
})

describe('arrayListTabs', async () => {
  it('组件渲染', async () => {
    const screen = render(ArrayListTabsTest)
    await expect.element(screen.getByText('No Data')).toBeInTheDocument()
  })

  it('基础交互', async () => {
    const screen = render(ArrayListTabsTest)
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await expect
      .element(screen.getByText('5'))
      .toBeInTheDocument()
    await screen.getByRole('textbox', { name: '请输入Input' }).fill('TEST_INPUT')
    await expect.element(screen.getByText('TEST_INPUT')).toBeInTheDocument()
  })
})
