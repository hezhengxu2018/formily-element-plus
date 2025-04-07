import { createForm } from '@formily/core'
import { Field } from '@formily/vue'
import { ElButton } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Form, FormItem, Input } from '../../index'
import FormButtonGroup from '../form-button-group.vue'
import 'element-plus/theme-chalk/index.css'

describe('FormButtonGroup', () => {
  it('默认渲染左对齐的按钮组', async () => {
    const { container } = render(
      () => (
        <FormButtonGroup>
          <ElButton>提交</ElButton>
          <ElButton>重置</ElButton>
        </FormButtonGroup>
      ),
    )

    const buttonGroup = container.querySelector('.formily-element-plus-form-button-group')
    expect(buttonGroup).not.toBeNull()

    const style = window.getComputedStyle(buttonGroup!)
    expect(style.justifyContent).toBe('flex-start')

    const buttons = container.querySelectorAll('.el-button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].textContent).toContain('提交')
    expect(buttons[1].textContent).toContain('重置')
  })

  it('渲染右对齐的按钮组', async () => {
    const { container } = render(
      () => (
        <FormButtonGroup align="right">
          <ElButton>提交</ElButton>
          <ElButton>重置</ElButton>
        </FormButtonGroup>
      ),
    )

    const buttonGroup = container.querySelector('.formily-element-plus-form-button-group')
    expect(buttonGroup).not.toBeNull()

    const style = window.getComputedStyle(buttonGroup!)
    expect(style.justifyContent).toBe('flex-end')
  })

  it('渲染居中对齐的按钮组', async () => {
    const { container } = render(
      () => (
        <FormButtonGroup align="center">
          <ElButton>提交</ElButton>
          <ElButton>重置</ElButton>
        </FormButtonGroup>
      ),
    )

    const buttonGroup = container.querySelector('.formily-element-plus-form-button-group')
    expect(buttonGroup).not.toBeNull()

    const style = window.getComputedStyle(buttonGroup!)
    expect(style.justifyContent).toBe('center')
  })

  it('自定义按钮间距', async () => {
    const { container } = render(
      () => (
        <FormButtonGroup gutter={20}>
          <ElButton>提交</ElButton>
          <ElButton>重置</ElButton>
        </FormButtonGroup>
      ),
    )

    const space = container.querySelector('.el-space')
    expect(space).not.toBeNull()
    expect(space!.getAttribute('style')).toContain('gap: 0px 20px;')
  })

  it('作为表单项对齐', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <Form
          form={form}
          labelCol={6}
          wrapperCol={10}
        >
          <Field name="test" title="测试标题长度长度长度" decorator={[FormItem]} component={[Input]}></Field>
          <FormButtonGroup alignFormItem={true}>
            <ElButton>提交</ElButton>
            <ElButton>重置</ElButton>
          </FormButtonGroup>
        </Form>
      ),
    )

    const formItem = container.querySelector('.formily-element-plus-form-item-item-col-6')
    expect(formItem).not.toBeNull()

    const formItemStyle = window.getComputedStyle(formItem!)
    expect(formItemStyle.margin).toBe('0px')
    expect(formItemStyle.padding).toBe('0px')

    const space = container.querySelector('.el-space')
    expect(space).not.toBeNull()

    const buttons = container.querySelectorAll('.el-button')
    expect(buttons.length).toBe(2)
  })

  it('传递属性到表单项', async () => {
    const { container } = render(
      () => (
        <FormButtonGroup
          alignFormItem={true}
          class="custom-form-item-class"
        >
          <ElButton>提交</ElButton>
          <ElButton>重置</ElButton>
        </FormButtonGroup>
      ),
    )

    const formItem = container.querySelector('.custom-form-item-class')
    expect(formItem).not.toBeNull()
  })
})
