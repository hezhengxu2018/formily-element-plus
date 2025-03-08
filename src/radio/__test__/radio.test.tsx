import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Radio from '../index'

describe('radio', () => {
  describe('单选框基础功能', () => {
    it('可以正确返显数据及正常交互', async () => {
      const form = createForm()
      const { getByRole } = render(() => (
        <FormProvider form={form}>
          <Field
            name="radio"
            component={[
              Radio,
              {
                value: true,
                label: '标签1',
              },
            ]}
          />
        </FormProvider>
      ))
      await expect.element(getByRole('radio')).not.toBeChecked()
      await getByRole('radio').click()
      await expect.element(getByRole('radio')).toBeChecked()
      expect(form.values).toEqual({ radio: true })
    })

    it('表单值的改变可以正确显示在控件上', async () => {
      const form = createForm()
      const { getByRole } = render(() => (
        <FormProvider form={form}>
          <Field
            name="radio"
            disabled={true}
            initialValue={true}
            component={[
              Radio,
            ]}
          />
        </FormProvider>
      ))
      await expect.element(getByRole('radio')).toBeDisabled()
      await expect.element(getByRole('radio')).toBeChecked()
      form.setFieldState('radio', field => field.disabled = false)
      await expect.element(getByRole('radio')).not.toBeDisabled()
    })

    it('支持自定义标签内容', async () => {
      const form = createForm()
      const { getByText } = render(() => (
        <FormProvider form={form}>
          <Field
            name="radio"
            component={[
              Radio,
              {
                label: '自定义标签',
              },
            ]}
          />
        </FormProvider>
      ))

      expect(getByText('自定义标签')).toBeTruthy()
    })
  })
})
