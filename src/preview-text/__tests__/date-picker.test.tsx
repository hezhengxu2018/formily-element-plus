import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import DatePicker from '../../date-picker'
import 'element-plus/theme-chalk/index.css'

describe('previewText.DatePicker', () => {
  it('基础日期显示', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="date"
            initialValue="2023-05-15"
            readPretty={true}
            component={[DatePicker]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('2023-05-15')
  })

  it('自定义日期格式', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="date"
            initialValue="2023-05-15"
            readPretty={true}
            component={[DatePicker, { format: 'YYYY年MM月DD日' }]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('2023年05月15日')
  })

  it('日期时间类型', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="datetime"
            initialValue="2023-05-15 14:30:00"
            readPretty={true}
            component={[DatePicker, {
              type: 'datetime',
              format: 'YYYY-MM-DD HH:mm:ss',
            }]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('2023-05-15 14:30:00')
  })

  it('日期范围显示', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="daterange"
            initialValue={['2023-05-01', '2023-05-15']}
            readPretty={true}
            component={[DatePicker, {
              type: 'daterange',
            }]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('2023-05-01')
    expect(container.textContent).toContain('2023-05-15')
  })

  it('自定义范围分隔符', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="daterange"
            initialValue={['2023-05-01', '2023-05-15']}
            readPretty={true}
            component={[DatePicker, {
              type: 'daterange',
              rangeSeparator: '至',
            }]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('2023-05-01 至 2023-05-15')
  })

  it('多个日期显示', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="dates"
            initialValue={['2023-05-01', '2023-05-15', '2023-05-30']}
            readPretty={true}
            component={[DatePicker, {
              type: 'dates',
            }]}
          />
        </FormProvider>
      ),
    )

    const tags = container.querySelectorAll('.el-tag')
    expect(tags.length).toBe(3)
    expect(tags[0].textContent).toContain('2023-05-01')
    expect(tags[1].textContent).toContain('2023-05-15')
    expect(tags[2].textContent).toContain('2023-05-30')
  })

  it('空值显示占位符', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="date"
            initialValue={null}
            readPretty={true}
            component={[DatePicker]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('N/A')
  })

  it('日期范围部分值显示', async () => {
    const form = createForm()
    const { container } = render(
      () => (
        <FormProvider form={form}>
          <Field
            name="daterange"
            initialValue={['2023-05-01', null]}
            readPretty={true}
            component={[DatePicker, {
              type: 'daterange',
            }]}
          />
        </FormProvider>
      ),
    )
    expect(container.textContent).toContain('2023-05-01')
    expect(container.textContent).toContain('N/A')
  })
})
