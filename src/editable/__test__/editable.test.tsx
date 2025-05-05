import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Editable, FormItem, Input, Submit } from '../../index'
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
    expect(container.querySelector('.formily-element-plus-editable')).not.toBeNull()
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
    const editBtn = container.querySelector('.formily-element-plus-editable-edit-btn')
    await userEvent.click(editBtn)
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

  it('应该正确触发表单校验', async () => {
    const fn = vi.fn()
    const schema = {
      type: 'object',
      properties: {
        input: {
          'type': 'string',
          'title': '输入框',
          'x-decorator': 'Editable',
          'x-component': 'Input',
          'x-validator': [
            { required: true, message: '输入框不能为空' },
            { max: 10, message: '输入内容不能超过10个字符' },
          ],
        },
      },
    }

    const { container, getByRole } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
        <Submit onSubmit={fn}>
          提交
        </Submit>
      </FormProvider>
    ))

    const editBtn = container.querySelector('.formily-element-plus-editable-edit-btn')
    await userEvent.click(editBtn)
    const input = container.querySelector('input')
    expect(input).not.toBeNull()
    await userEvent.type(input, '超过十个字符的内容内容内容内容内容')
    await userEvent.click(document.body)
    await getByRole('button', { name: '提交' }).click()
    const errorMessage = document.querySelector('.formily-element-plus-form-item-feedback.is-error')
    expect(errorMessage).not.toBeNull()
    expect(errorMessage.textContent).toContain('输入内容不能超过10个字符')
    expect(fn).not.toHaveBeenCalled()
  })
})
