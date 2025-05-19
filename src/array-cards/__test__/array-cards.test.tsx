import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import { ArrayCards, FormItem, Input } from '../../index'
import 'element-plus/theme-chalk/index.css'

// 字符串数组测试组件
export function ArrayCardsStringTestFactory(form = createForm()) {
  return defineComponent({
    name: 'ArrayCardsStringTest',
    setup() {
      const { SchemaField } = createSchemaField({
        components: {
          FormItem,
          Input,
          ArrayCards,
        },
      })

      const schema = {
        type: 'object',
        properties: {
          string_array: {
            'type': 'array',
            'x-component': 'ArrayCards',
            'x-decorator': 'FormItem',
            'x-component-props': {
              title: '字符串数组',
            },
            'items': {
              type: 'void',
              properties: {
                index: {
                  'type': 'void',
                  'x-component': 'ArrayCards.Index',
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
                  'x-component': 'ArrayCards.Remove',
                },
                moveUp: {
                  'type': 'void',
                  'x-component': 'ArrayCards.MoveUp',
                },
                moveDown: {
                  'type': 'void',
                  'x-component': 'ArrayCards.MoveDown',
                },
              },
            },
            'properties': {
              addition: {
                'type': 'void',
                'title': '添加条目',
                'x-component': 'ArrayCards.Addition',
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
export const ArrayCardsObjectTest = defineComponent({
  name: 'ArrayCardsObjectTest',
  setup() {
    const { SchemaField } = createSchemaField({
      components: {
        FormItem,
        Input,
        ArrayCards,
      },
    })

    const form = createForm()
    const schema = {
      type: 'object',
      properties: {
        array: {
          'type': 'array',
          'x-component': 'ArrayCards',
          'x-decorator': 'FormItem',
          'x-component-props': {
            title: '对象数组',
          },
          'items': {
            type: 'object',
            properties: {
              index: {
                'type': 'void',
                'x-component': 'ArrayCards.Index',
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
                'x-component': 'ArrayCards.Remove',
              },
              moveUp: {
                'type': 'void',
                'x-component': 'ArrayCards.MoveUp',
              },
              moveDown: {
                'type': 'void',
                'x-component': 'ArrayCards.MoveDown',
              },
            },
          },
          'properties': {
            addition: {
              'type': 'void',
              'title': '添加条目',
              'x-component': 'ArrayCards.Addition',
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

describe('ArrayCards', async () => {
  // 测试字符串数组渲染
  it('字符串数组渲染', async () => {
    const screen = render(ArrayCardsStringTestFactory())
    await expect.element(screen.getByText('添加条目')).toBeInTheDocument()
    await screen.getByText('添加条目').click()
    await expect.element(screen.getByText('字符串数组')).toBeInTheDocument()
    const card = screen.container.querySelector('.el-card')
    expect(card).toBeInTheDocument()
  })

  // 测试对象数组渲染
  it('对象数组渲染', async () => {
    const screen = render(ArrayCardsObjectTest)
    await expect.element(screen.getByText('添加条目')).toBeInTheDocument()
    const empty = screen.container.querySelector('.el-empty')
    expect(empty).toBeInTheDocument()
    await screen.getByText('添加条目').click()
    await expect.element(screen.getByText('对象数组')).toBeInTheDocument()
  })

  // 测试添加条目功能
  it('添加条目功能', async () => {
    const screen = render(ArrayCardsStringTestFactory())
    await screen.getByText('添加条目').click()
    // 添加后应该有一个输入框
    await expect.element(screen.getByRole('textbox')).toBeInTheDocument()
    // 验证卡片标题存在
    await expect.element(screen.getByText('字符串数组')).toBeInTheDocument()
  })

  // 测试添加多个条目
  it('添加多个条目', async () => {
    const screen = render(ArrayCardsObjectTest)
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // 检查是否有3个输入框
    const inputs = screen.getByRole('textbox')
    expect(inputs.elements()).toHaveLength(3)

    // 验证卡片数量
    const cards = screen.container.querySelectorAll('.el-card')
    expect(cards.length).toBe(3)
  })

  // 测试删除条目功能
  it('删除条目功能', async () => {
    const screen = render(ArrayCardsStringTestFactory())
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

    // 验证卡片数量
    const cards = screen.container.querySelectorAll('.el-card')
    expect(cards.length).toBe(1)
  })

  // 测试上移下移功能
  it('上移下移功能', async () => {
    const screen = render(ArrayCardsObjectTest)
    await screen.getByText('添加条目').click()
    await screen.getByText('添加条目').click()

    // 在第一个输入框中输入值
    const inputs = screen.getByRole('textbox')
    await inputs.nth(0).fill('第一项')
    await inputs.nth(1).fill('第二项')

    // 点击下移按钮
    const moveDownButtons = screen.getByRole('button', { name: /下移/ })
    await moveDownButtons.nth(0).click()

    // 验证顺序已经改变
    const updatedInputs = screen.getByRole('textbox')
    await expect.element(updatedInputs.nth(0)).toHaveValue('第二项')
    await expect.element(updatedInputs.nth(1)).toHaveValue('第一项')

    // 点击上移按钮
    const moveUpButtons = screen.getByRole('button', { name: /上移/ })
    await moveUpButtons.nth(1).click()

    // 验证顺序已恢复
    const finalInputs = screen.getByRole('textbox')
    await expect.element(finalInputs.nth(0)).toHaveValue('第一项')
    await expect.element(finalInputs.nth(1)).toHaveValue('第二项')
  })

  // 测试表单数据同步
  it('表单数据同步', async () => {
    const form = createForm()
    const screen = render(ArrayCardsStringTestFactory(form))

    // 初始状态下数组应为空
    expect(form.values.string_array).toHaveLength(0)

    // 添加条目
    await screen.getByText('添加条目').click()
    expect(form.values.string_array).toHaveLength(1)

    // 输入值
    const input = screen.getByRole('textbox')
    await input.fill('测试数据')

    // 验证表单数据已更新
    expect(form.values.string_array[0]).toBe('测试数据')

    // 删除条目
    const removeButton = screen.getByRole('button', { name: /移除条目/ })
    await removeButton.click()

    // 验证表单数据已清空
    expect(form.values.string_array).toHaveLength(0)
  })
})
