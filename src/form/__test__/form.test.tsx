import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Input } from '../../index'
import Form from '../form.vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'

describe('form 组件测试', () => {
  it('基础渲染', async () => {
    const form = createForm()
    const { container } = render(() => (
      <Form form={form}>
        <button type="submit">提交</button>
      </Form>
    ))

    // 应该通过查询 DOM 元素而不是使用角色定位
    const formElement = container.querySelector('form')
    expect(formElement).toBeInTheDocument()
  })

  it('未提供任何form实例时无法渲染', async () => {
    const { container } = render(() => <Form />)
    const formElement = container.querySelector('form')
    expect(formElement).not.toBeInTheDocument()
  })

  it('表单提交功能', async () => {
    const form = createForm()
    const mockSubmit = vi.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1000)
      })
    })
    const { getByText, getByRole } = render(() => (
      <Form form={form} onAutoSubmit={mockSubmit}>
        <Field name="name" component={[Input]} />
        <button type="submit">提交</button>
      </Form>
    ))

    await getByText('提交').click()
    await getByRole('button', { name: '提交' }).selector.includes('.is-loading')
    expect(mockSubmit).toHaveBeenCalled()
  })

  it('支持修改预览占位符', async () => {
    const form = createForm()
    const { getByText } = render(() => (
      <Form form={form} previewTextPlaceholder="--">
        <Field name="name" component={[Input]} readPretty={true} />
      </Form>
    ))

    await expect.element(getByText('--')).toBeInTheDocument()
  })

  it('支持传入 form 实例', async () => {
    const form = createForm()
    const { getByRole } = render(() => (
      <Form form={form}>
        <Field
          name="test"
          component={[Input]}
        />
      </Form>
    ))
    await getByRole('textbox').fill('123')
    expect(form.values.test).toEqual('123')
  })

  it('支持继承外部 form 实例', async () => {
    const form = createForm()
    const { getByRole } = render(() => (
      <FormProvider form={form}>
        <Form>
          <Field
            name="test"
            component={[Input]}
          />
        </Form>
      </FormProvider>
    ))
    await getByRole('textbox').fill('123')
    expect(form.values.test).toEqual('123')
  })
})
