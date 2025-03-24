import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Select from '../index'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-select.css'

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
]

const groupOptions = [
  {
    label: 'Group 1',
    options: [
      { value: 'g1-1', label: 'Group 1 Option 1' },
      { value: 'g1-2', label: 'Group 1 Option 2' },
    ],
  },
  {
    label: 'Group 2',
    options: [
      { value: 'g2-1', label: 'Group 2 Option 1' },
      { value: 'g2-2', label: 'Group 2 Option 2' },
    ],
  },
]

describe('select 组件', () => {
  describe('基础功能', () => {
    it('正常渲染选项', async () => {
      const page = render(() => (
        <FormProvider form={createForm()}>
          <Field
            name="select"
            component={[Select]}
            dataSource={options}
          />
        </FormProvider>
      ))
      await expect.element(page.getByRole('combobox')).toBeInTheDocument()
      // await expect.element(page.getByText('Select')).toBeInTheDocument()
      // await page.getByText('Select').click()
      // const Options = page.getByRole('option').all()
      // expect(Options).toHaveLength(3)
    })

    it('支持分组选项', async () => {
      const { getByText, getByRole } = render(() => (
        <FormProvider form={createForm()}>
          <Field
            name="select"
            component={[Select]}
            dataSource={groupOptions}
          />
        </FormProvider>
      ))

      const selectDOM = getByText('Select')
      await selectDOM.click()
      const groups = document.querySelectorAll('.el-select-group__title')
      expect(groups).toHaveLength(2)
      const optionDOMNodes = getByRole('option').all()
      expect(optionDOMNodes).toHaveLength(4)
    })
  })

  // describe('表单交互', () => {
  //   it('单选模式更新表单值', async () => {
  //     const form = createForm()
  //     const { getByRole } = render(() => (
  //       <FormProvider form={form}>
  //         <Field
  //           name="select"
  //           component={Select}
  //           options={options}
  //         />
  //       </FormProvider>
  //     ))

  //     await waitFor(async () => {
  //       const select = getByRole('combobox')
  //       select.click()
  //       const option = document.querySelector('[data-value="2"]')
  //       option?.click()
  //       expect(form.values.select).toEqual('2')
  //     })
  //   })

  //   it('多选模式更新表单值', async () => {
  //     const form = createForm()
  //     const { getByRole } = render(() => (
  //       <FormProvider form={form}>
  //         <Field
  //           name="select"
  //           component={Select}
  //           options={options}
  //           multiple
  //         />
  //       </FormProvider>
  //     ))

  //     await waitFor(async () => {
  //       const select = getByRole('combobox')
  //       select.click()
  //       const options = document.querySelectorAll('.el-select-dropdown__item')
  //       options[0]?.click()
  //       options[2]?.click()
  //       expect(form.values.select).toEqual(['1', '3'])
  //     })
  //   })
  // })

  // describe('属性传递', () => {
  //   it('支持禁用状态', async () => {
  //     const { getByRole } = render(() => (
  //       <Select options={options} disabled />
  //     ))

  //     const select = getByRole('combobox')
  //     expect(select).toHaveClass('is-disabled')
  //   })

  //   it('支持可清空选项', async () => {
  //     const { getByRole } = render(() => (
  //       <Select options={options} clearable value="1" />
  //     ))

  //     await waitFor(() => {
  //       const clearIcon = document.querySelector('.el-select__clear')
  //       expect(clearIcon).toBeInTheDocument()
  //     })
  //   })
  // })

  // describe('插槽支持', () => {
  //   it('自定义选项内容', async () => {
  //     const { getByRole } = render(() => (
  //       <Select options={options}>
  //         {{
  //           option: ({ option }) => <div class="custom-option">{option.label}</div>,
  //         }}
  //       </Select>
  //     ))

  //     await waitFor(() => {
  //       const select = getByRole('combobox')
  //       select.click()
  //       const customOption = document.querySelector('.custom-option')
  //       expect(customOption).toBeInTheDocument()
  //     })
  //   })
  // })
})
