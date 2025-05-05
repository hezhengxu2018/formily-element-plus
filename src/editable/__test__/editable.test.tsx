import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Editable, FormItem, Input } from '../../index'
import 'element-plus/theme-chalk/index.css'

describe('Editable', () => {
  let form
  let SchemaField

  beforeEach(() => {
    document.body.innerHTML = ''
    form = createForm()
    const { SchemaField: _SchemaField } = createSchemaField({
      components: {
        FormItem,
        Input,
        Editable,
      },
    })
    SchemaField = _SchemaField
  })

  it('应该正确渲染 Editable 组件', async () => {
    const schema = {
      type: 'object',
      properties: {
        input: {
          'type': 'string',
          'title': '输入框',
          'x-decorator': 'Editable',
          'x-component': 'Input',
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))

    // 检查是否渲染了 Editable 组件
    expect(container.querySelector('.formily-element-plus-editable')).not.toBeNull()

    // 检查是否渲染了编辑按钮
    expect(container.querySelector('.formily-element-plus-editable-edit-btn')).not.toBeNull()
  })

  it('点击 Editable 组件应该进入编辑模式', async () => {
    const schema = {
      type: 'object',
      properties: {
        input: {
          'type': 'string',
          'title': '输入框',
          'x-decorator': 'Editable',
          'x-component': 'Input',
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))

    // 点击编辑按钮
    const editBtn = container.querySelector('.formily-element-plus-editable-edit-btn')
    await userEvent.click(editBtn)

    // 检查是否显示关闭按钮（表示进入编辑模式）
    expect(container.querySelector('.formily-element-plus-editable-close-btn')).not.toBeNull()
  })

  it('点击 Editable 组件外部应该退出编辑模式', async () => {
    const schema = {
      type: 'object',
      properties: {
        input: {
          'type': 'string',
          'title': '输入框',
          'x-decorator': 'Editable',
          'x-component': 'Input',
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))

    // 点击编辑按钮进入编辑模式
    const editBtn = container.querySelector('.formily-element-plus-editable-edit-btn')
    await userEvent.click(editBtn)

    // 确认进入编辑模式
    expect(container.querySelector('.formily-element-plus-editable-close-btn')).not.toBeNull()

    // 点击外部区域
    await userEvent.click(document.body)

    // 检查是否退出编辑模式（关闭按钮消失，编辑按钮出现）
    await vi.waitFor(() => {
      expect(container.querySelector('.formily-element-plus-editable-close-btn')).toBeNull()
      expect(container.querySelector('.formily-element-plus-editable-edit-btn')).not.toBeNull()
    })
  })

  it('点击关闭按钮应该退出编辑模式', async () => {
    const schema = {
      type: 'object',
      properties: {
        input: {
          'type': 'string',
          'title': '输入框',
          'x-decorator': 'Editable',
          'x-component': 'Input',
          'x-data': {
            test: 'test',
          },
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))

    // 点击编辑按钮进入编辑模式
    const editBtn = container.querySelector('.formily-element-plus-editable-edit-btn')
    await userEvent.click(editBtn)

    // 确认进入编辑模式
    const closeBtn = container.querySelector('.formily-element-plus-editable-close-btn')
    expect(closeBtn).not.toBeNull()

    // 点击关闭按钮
    await userEvent.click(closeBtn)

    // 检查是否退出编辑模式
    await vi.waitFor(() => {
      expect(container.querySelector('.formily-element-plus-editable-close-btn')).toBeNull()
      expect(container.querySelector('.formily-element-plus-editable-edit-btn')).not.toBeNull()
    })

    expect(form.getFieldState('input').data.test).toEqual('test')
  })
})
