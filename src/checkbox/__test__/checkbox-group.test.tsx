import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Checkbox from '../index'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-checkbox.css'

describe('基础数据展示及交互', async () => {
  it('正常渲染', async () => {
    const form = createForm()
    const { getByText } = render(() => (
      <FormProvider form={form}>
        <Field
          name="checkbox"
          component={[
            Checkbox.Group,
          ]}
          dataSource={[{ label: '标签1', value: '1' }, { label: '标签2', value: '2' }]}
        />
      </FormProvider>
    ))
    await expect.element(getByText('标签1')).toBeInTheDocument()
    await getByText('标签1').click()
    expect(form.values.checkbox).toEqual(['1'])
    await getByText('标签2').click()
    expect(form.values.checkbox).toEqual(['1', '2'])
  })

  it('可以正确返显数据', async () => {
    const form = createForm()
    const { getByRole } = render(() => (
      <FormProvider form={form}>
        <Field
          name="checkbox"
          initialValue={['1']}
          component={[
            Checkbox.Group,
          ]}
          dataSource={[{ label: '标签1', value: '1' }, { label: '标签2', value: '2' }]}
        />
      </FormProvider>
    ))
    await expect.element(getByRole('checkbox', { name: '标签1' })).toBeChecked()
    form.setValues({
      checkbox: ['2'],
    })
    await expect.element(getByRole('checkbox', { name: '标签1' })).not.toBeChecked()
    await expect.element(getByRole('checkbox', { name: '标签2' })).toBeChecked()
  })
})

describe('使用插槽渲染', async () => {
  it('可以正确渲染', async () => {
    const form = createForm()
    const { getByText } = render(() => (
      <FormProvider form={form}>
        <Field
          name="checkbox"
          component={[
            Checkbox.Group,
          ]}
          dataSource={[{ label: '标签1', value: '1' }, { label: '标签2', value: '2' }]}
        >
          {({ option }) => (`使用插槽渲染的${option.label}`)}
        </Field>
      </FormProvider>
    ))
    await expect.element(getByText('使用插槽渲染的标签1')).toBeInTheDocument()
  })
})  
