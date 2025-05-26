import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import { ArrayCollapse, FormItem, Input, Submit } from '../../index'
import 'element-plus/theme-chalk/index.css'

// 字符串数组测试组件
export function ArrayCollapseStringTestFactory(form = createForm()) {
  return defineComponent({
    name: 'ArrayCollapseStringTest',
    setup() {
      const { SchemaField } = createSchemaField({
        components: {
          FormItem,
          Input,
          ArrayCollapse,
        },
      })

      const schema = {
        type: 'object',
        properties: {
          string_array: {
            'type': 'array',
            'x-component': 'ArrayCollapse',
            'maxItems': 3,
            'x-decorator': 'FormItem',
            'items': {
              'type': 'object',
              'x-component': 'ArrayCollapse.Item',
              'x-component-props': {
                title: '字符串数组',
              },
              'properties': {
                index: {
                  'type': 'void',
                  'x-component': 'ArrayCollapse.Index',
                },
                input: {
                  'type': 'string',
                  'x-decorator': 'FormItem',
                  'title': 'Input',
                  'required': true,
                  'x-component': 'Input',
                },
                remove: {
                  'type': 'void',
                  'x-component': 'ArrayCollapse.Remove',
                },
                moveUp: {
                  'type': 'void',
                  'x-component': 'ArrayCollapse.MoveUp',
                },
                moveDown: {
                  'type': 'void',
                  'x-component': 'ArrayCollapse.MoveDown',
                },
              },
            },
            'properties': {
              addition: {
                'type': 'void',
                'title': '添加条目',
                'x-component': 'ArrayCollapse.Addition',
              },
            },
          },
        },
      }

      return () => (
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      )
    },
  })
}

// 对象数组测试组件
export const ArrayCollapseObjectTest = defineComponent({
  name: 'ArrayCollapseObjectTest',
  setup() {
    const { SchemaField } = createSchemaField({
      components: {
        FormItem,
        Input,
        ArrayCollapse,
      },
    })

    const form = createForm()
    const schema = {
      type: 'object',
      properties: {
        array: {
          'type': 'array',
          'x-component': 'ArrayCollapse',
          'maxItems': 3,
          'x-decorator': 'FormItem',
          'items': {
            'type': 'object',
            'x-component': 'ArrayCollapse.Item',
            'x-component-props': {
              title: '对象数组',
            },
            'properties': {
              index: {
                'type': 'void',
                'x-component': 'ArrayCollapse.Index',
              },
              input: {
                'type': 'string',
                'x-decorator': 'FormItem',
                'title': 'Input',
                'required': true,
                'x-component': 'Input',
              },
              remove: {
                'type': 'void',
                'x-component': 'ArrayCollapse.Remove',
              },
              moveUp: {
                'type': 'void',
                'x-component': 'ArrayCollapse.MoveUp',
              },
              moveDown: {
                'type': 'void',
                'x-component': 'ArrayCollapse.MoveDown',
              },
            },
          },
          'properties': {
            addition: {
              'type': 'void',
              'title': '添加条目',
              'x-component': 'ArrayCollapse.Addition',
            },
          },
        },
      },
    }

    return () => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    )
  },
})

// 测试unshift添加方法
export const ArrayCollapseUnshiftTest = defineComponent({
  name: 'ArrayCollapseUnshiftTest',
  setup() {
    const { SchemaField } = createSchemaField({
      components: {
        FormItem,
        Input,
        ArrayCollapse,
      },
    })

    const form = createForm()
    const schema = {
      type: 'object',
      properties: {
        array_unshift: {
          'type': 'array',
          'x-component': 'ArrayCollapse',
          'maxItems': 3,
          'x-decorator': 'FormItem',
          'items': {
            'type': 'object',
            'x-component': 'ArrayCollapse.Item',
            'x-component-props': {
              title: '对象数组',
            },
            'properties': {
              index: {
                'type': 'void',
                'x-component': 'ArrayCollapse.Index',
              },
              input: {
                'type': 'string',
                'x-decorator': 'FormItem',
                'title': 'Input',
                'required': true,
                'x-component': 'Input',
              },
              remove: {
                'type': 'void',
                'x-component': 'ArrayCollapse.Remove',
              },
              moveUp: {
                'type': 'void',
                'x-component': 'ArrayCollapse.MoveUp',
              },
              moveDown: {
                'type': 'void',
                'x-component': 'ArrayCollapse.MoveDown',
              },
            },
          },
          'properties': {
            addition: {
              'type': 'void',
              'title': '添加条目(unshift)',
              'x-component': 'ArrayCollapse.Addition',
              'x-component-props': {
                method: 'unshift',
              },
            },
          },
        },
      },
    }

    return () => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
        <Submit onSubmit={console.log}>提交</Submit>
      </FormProvider>
    )
  },
})

// 测试默认展开面板数量
export function ArrayCollapseDefaultOpenTest(form = createForm()) {
  return defineComponent({
    name: 'ArrayCollapseDefaultOpenTest',
    setup() {
      const { SchemaField } = createSchemaField({
        components: {
          FormItem,
          Input,
          ArrayCollapse,
        },
      })

      const schema = {
        type: 'object',
        properties: {
          string_array: {
            'type': 'array',
            'x-component': 'ArrayCollapse',
            'x-component-props': {
              defaultOpenPanelCount: 2,
            },
            'x-decorator': 'FormItem',
            'items': {
              'type': 'object',
              'x-component': 'ArrayCollapse.Item',
              'x-component-props': {
                title: '字符串数组',
              },
              'properties': {
                index: {
                  'type': 'void',
                  'x-component': 'ArrayCollapse.Index',
                },
                input: {
                  'type': 'string',
                  'x-decorator': 'FormItem',
                  'title': 'Input',
                  'required': true,
                  'x-component': 'Input',
                },
                remove: {
                  'type': 'void',
                  'x-component': 'ArrayCollapse.Remove',
                },
              },
            },
            'properties': {
              addition: {
                'type': 'void',
                'title': '添加条目',
                'x-component': 'ArrayCollapse.Addition',
              },
            },
          },
        },
      }

      return () => (
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      )
    },
  })
}

describe('ArrayCollapse', async () => {
  // 测试字符串数组渲染
  it('字符串数组渲染', async () => {
    const screen = render(ArrayCollapseStringTestFactory())
    await expect.element(screen.getByText('添加条目')).toBeInTheDocument()
    await screen.getByText('添加条目').click()
    await expect.element(screen.getByText('字符串数组')).toBeInTheDocument()
  })

  // 测试对象数组渲染
  it('对象数组渲染', async () => {
    const screen = render(ArrayCollapseObjectTest)
    await expect.element(screen.getByText('添加条目')).toBeInTheDocument()
    await screen.getByText('添加条目').click()
    await expect.element(screen.getByText('对象数组')).toBeInTheDocument()
  })

  // 测试添加条目功能
  it('添加条目功能', async () => {
    const screen = render(ArrayCollapseStringTestFactory())
    await screen.getByText('添加条目').click()
    // 添加后应该有一个输入框
    await expect.element(screen.getByRole('textbox')).toBeInTheDocument()
  })

  // 测试添加多个条目
  it('添加多个条目', async () => {
    const screen = render(ArrayCollapseObjectTest)
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // 检查是否有3个输入框
    const inputs = screen.getByRole('textbox')
    expect(inputs.elements()).toHaveLength(3)
  })

  // 测试删除条目功能
  it('删除条目功能', async () => {
    const screen = render(ArrayCollapseStringTestFactory())
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // 应该有2个输入框
    let inputs = screen.getByRole('textbox')
    expect(inputs.elements()).toHaveLength(2)

    // 点击第一个删除按钮
    const removeButtons = screen.getByRole('button', { name: /移除条目/ })
    await removeButtons.nth(0).click()

    // 应该只剩1个输入框
    inputs = screen.getByRole('textbox')
    expect(inputs.elements()).toHaveLength(1)
  })

  // 测试上移下移功能
  it('上移下移功能', async () => {
    const form = createForm()
    const screen = render(ArrayCollapseStringTestFactory(form))
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // 在输入框中输入值
    const inputs = screen.getByRole('textbox')
    await inputs.nth(0).fill('第一项')
    await inputs.nth(1).fill('第二项')

    // 点击下移按钮
    const moveDownButtons = screen.getByRole('button', { name: '下移条目', exact: true })
    await moveDownButtons.nth(0).click()

    expect(form.values.string_array[0].input).toEqual('第二项')
    expect(form.values.string_array[1].input).toEqual('第一项')

    const moveUpButtons = screen.getByRole('button', { name: '上移条目', exact: true })
    await moveUpButtons.nth(1).click()
    expect(form.values.string_array[0].input).toEqual('第一项')
    expect(form.values.string_array[1].input).toEqual('第二项')
  })

  // 测试unshift添加方法
  it('unshift添加方法', async () => {
    const form = createForm()
    const screen = render(ArrayCollapseUnshiftTest, { props: { form } })
    await screen.getByText('添加条目(unshift)').click()
    await screen.getByText('添加条目(unshift)').click()

    // 在输入框中输入值
    const inputs = screen.getByRole('textbox')
    await inputs.nth(0).fill('第一项')
    await inputs.nth(1).fill('第二项')

    await screen.getByText('添加条目(unshift)').click()

    expect(form.values.array_unshift.length).toBe(3)

    // 填写新添加的项
    await screen.getByRole('textbox').nth(0).fill('第三项')

    // 验证顺序是否正确
    await vi.waitFor(() => {
      expect(form.values.array_unshift[0].input).toBe('第三项')
      expect(form.values.array_unshift[1].input).toBe('第一项')
      expect(form.values.array_unshift[2].input).toBe('第二项')
    })
  })

  // 测试默认展开面板数量
  it.skip('默认展开面板数量', async () => {
    const form = createForm({
      initialValues: {
        string_array: [
          { input: '第一项' },
          { input: '第二项' },
          { input: '第三项' },
        ],
      },
    })
    const screen = render(ArrayCollapseDefaultOpenTest(form))

    // 验证只有前两个面板是展开的
    const collapseItems = screen.container.querySelectorAll('.el-collapse-item__wrap')
    expect(collapseItems.length).toBe(2)
  })

  // 测试折叠/展开功能
  it.skip('折叠/展开功能', async () => {
    const screen = render(ArrayCollapseStringTestFactory())
    await screen.getByText('添加条目').click()

    // 验证面板是展开的
    let collapseItem = screen.container.querySelector('.el-collapse-item__wrap')
    expect(collapseItem).toBeInTheDocument()

    // 点击折叠面板
    await screen.getByText('字符串数组').click()

    // 验证面板已折叠
    await vi.waitFor(() => {
      collapseItem = screen.container.querySelector('.el-collapse-item__wrap')
      expect(collapseItem).not.toBeInTheDocument()
    })
  })
})
