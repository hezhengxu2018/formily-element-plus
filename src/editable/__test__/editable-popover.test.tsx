import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { DatePicker, Editable, FormItem, Input } from '../../index'
import 'element-plus/theme-chalk/index.css'

describe('Editable.Popover', () => {
  let form
  let SchemaField

  beforeEach(() => {
    document.body.innerHTML = ''
    form = createForm()
    const { SchemaField: _SchemaField } = createSchemaField({
      components: {
        FormItem,
        Input,
        DatePicker,
        Editable,
      },
    })
    SchemaField = _SchemaField
  })

  it('应该正确渲染 Editable.Popover 组件', async () => {
    const schema = {
      type: 'object',
      properties: {
        void: {
          'type': 'void',
          'title': '虚拟节点容器',
          'x-component': 'Editable.Popover',
          'properties': {
            date: {
              'type': 'string',
              'title': '日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
            },
            input: {
              'type': 'string',
              'title': '输入框',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))

    // 检查是否渲染了 Editable.Popover 组件
    expect(container.querySelector('.formily-element-plus-editable')).not.toBeNull()

    // 检查是否渲染了编辑按钮
    expect(container.querySelector('.formily-element-plus-editable-edit-btn')).not.toBeNull()
  })

  it('点击 Editable.Popover 触发器应该显示弹出层', async () => {
    const schema = {
      type: 'object',
      properties: {
        void: {
          'type': 'void',
          'title': '虚拟节点容器',
          'x-component': 'Editable.Popover',
          'properties': {
            date: {
              'type': 'string',
              'title': '日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
            },
            input: {
              'type': 'string',
              'title': '输入框',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))

    const trigger = container.querySelector('.formily-element-plus-editable-trigger')
    await userEvent.click(trigger)

    expect(document.querySelector('.el-popover')).not.toBeNull()
  })

  it('点击弹出层外部应该关闭弹出层', async () => {
    const schema = {
      type: 'object',
      properties: {
        void: {
          'type': 'void',
          'title': '虚拟节点容器',
          'x-component': 'Editable.Popover',
          'properties': {
            date: {
              'type': 'string',
              'title': '日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
            },
            input: {
              'type': 'string',
              'title': '输入框',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    }

    const { container } = render(() => (
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    ))
    const trigger = container.querySelector('.formily-element-plus-editable-trigger')
    await userEvent.click(trigger)

    await userEvent.click(document.body)
    await vi.waitFor(() => {
      expect(document.querySelector('.el-popover')).not.toBeVisible()
    })
  })
})
