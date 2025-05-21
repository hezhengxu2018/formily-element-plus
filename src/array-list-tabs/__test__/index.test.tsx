import { Close } from '@element-plus/icons-vue'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import { ArrayListTabs, FormItem, Input } from '../../index'
import 'element-plus/theme-chalk/index.css'

export const ArrayListTabsTest = defineComponent({
  name: 'TestComponent',
  props: {
    form: {
      type: Object,
      default: () => createForm(),
    },
  },
  setup(props) {
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

    return () => (
      <FormProvider form={props.form}>
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
  })

  it('数据输入测试', async () => {
    const form = createForm()
    const screen = render(ArrayListTabsTest, { props: { form } })
    // 添加一个条目
    await screen.getByText('添加条目').click()

    // 获取输入框并输入数据
    const inputField = screen.getByPlaceholder('请输入Input')
    await inputField.fill('测试标题')
    await expect.element(screen.getByText('测试标题')).toBeInTheDocument()

    // 获取第二个输入框并输入数据
    await screen.getByLabelText('input2').fill('测试内容')

    expect(form.values.array[0].input).toBe('测试标题')
    expect(form.values.array[0].input2).toBe('测试内容')
  })

  it('tab页切换测试', async () => {
    const screen = render(ArrayListTabsTest)

    // 添加三个条目
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // 为每个条目设置不同的标题
    const inputFields = screen.getByPlaceholder('请输入Input')
    await inputFields.nth(0).fill('Tab 1')
    await screen.getByText('未命名条目').nth(0).click()
    await inputFields.nth(1).fill('Tab 2')
    await screen.getByText('未命名条目').nth(0).click()
    await inputFields.nth(2).fill('Tab 3')
    await screen.getByText('Tab 2').click()
  })

  it('关闭tab页测试', async () => {
    const screen = render(ArrayListTabsTest)

    // 添加两个条目
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // // 为每个条目设置不同的标题
    const inputFields = screen.getByPlaceholder('请输入Input')
    await inputFields.nth(0).fill('Tab 1')
    await screen.getByText('未命名条目').nth(0).click()
    await inputFields.nth(1).fill('Tab 2')
    await expect.element(screen.getByText('Tab 1')).toBeInTheDocument()
    await expect.element(screen.getByText('Tab 2')).toBeInTheDocument()

    // 获取删除按钮并点击第一个tab的删除按钮
    const removeButtons = screen.container.querySelectorAll('.formily-element-plus-array-base-remove')
    await userEvent.click(removeButtons[1])

    await expect.element(screen.getByText('Tab 1')).toBeInTheDocument()
    const activeTab = screen.container.querySelector('.is-active')
    expect(activeTab.textContent).toContain('Tab 1')
  })
})
