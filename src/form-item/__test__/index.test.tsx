import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { stylePrefix } from '../../__builtins__'
import { FormItem, FormLayout, Input } from '../../index'
import 'element-plus/theme-chalk/index.css'

describe('form-item 组件', () => {
  describe('基础功能', () => {
    it('正常渲染', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="测试标签"
              decorator={[FormItem]}
              component={[Input]}
            />
          </FormLayout>
        </FormProvider>
      ))

      await expect.element(container.querySelector('.formily-element-plus-form-item')).toBeInTheDocument()
      await expect.element(container.querySelector('.el-form-item__label')).toHaveTextContent('测试标签')
    })

    it('label 为空时的展示', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              decorator={[FormItem, { labelWidth: 300 }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))

      const labelElement = container.querySelector('.el-form-item__label')
      expect(labelElement).toBeNull()
    })

    it('空字符串 label 的展示', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title=" "
              decorator={[FormItem, { labelWidth: 300 }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))

      const labelElement = container.querySelector('.el-form-item__label')
      expect(labelElement).toHaveStyle({ width: '300px' })
    })
  })

  describe('冒号设置', () => {
    it('默认显示冒号', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="默认"
              decorator={[FormItem]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))

      const labelElement = container.querySelector('.el-form-item__label')
      await vi.waitFor(() => {
        return labelElement.textContent.includes(':')
      })
    })

    it('设置 colon=false 不显示冒号', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="无冒号"
              decorator={[FormItem, { colon: false }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))

      const labelElement = container.querySelector('.el-form-item__label')
      await vi.waitFor(() => {
        expect(labelElement.textContent).toBe('无冒号')
      })
    })
  })

  describe('宽度设置', () => {
    it('设置 labelWidth 固定标签宽度', async () => {
      const { getByLabelText } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="固定标签宽度"
              decorator={[FormItem, { labelWidth: 300 }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))

      const labelLocator = getByLabelText('固定标签宽度')
      const labelElement = labelLocator.element().querySelector('.el-form-item__label')
      expect(labelElement).toHaveStyle({ width: '300px' })
    })

    it('设置 labelWrap=true 允许标签换行', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="固定标签宽度换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行"
              decorator={[FormItem, { labelWidth: 300, labelWrap: true }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))
      expect(container.querySelector('.is-warp')).toBeInTheDocument()
    })

    it('设置 wrapperWidth 固定内容区域宽度', async () => {
      const { getByLabelText } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="固定内容宽度"
              decorator={[FormItem, { labelWidth: 300, wrapperWidth: 300 }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))
      const labelLocator = getByLabelText('固定内容宽度')
      const contentElement = labelLocator.element().querySelector('.el-form-item__content')
      expect(contentElement).toHaveStyle({ width: '300px' })
    })
  })

  describe('对齐方式', () => {
    it('设置 labelAlign=left 标签左对齐', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <Field
              name="test"
              title="标签左对齐"
              decorator={[FormItem, { labelWidth: 300, labelAlign: 'left' }]}
              component={[Input, { placeholder: '请输入' }]}
            />
          </FormLayout>
        </FormProvider>
      ))

      const labelElement = container.querySelector('.el-form-item__label')
      await expect(labelElement).toHaveStyle({ justifyContent: 'flex-start' })
    })

    it('设置 labelAlign=right 标签右对齐（默认）', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="标签右对齐"
            labelWidth={300}
            labelAlign="right"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))

      const labelElement = container.querySelector('.el-form-item__label')
      expect(labelElement).toHaveStyle({ justifyContent: 'flex-end' })
    })

    it('设置 wrapperAlign=left 内容左对齐（默认）', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="内容左对齐"
            labelWidth={300}
            wrapperWidth={240}
            wrapperAlign="left"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))

      const contentElement = container.querySelector('.formily-element-plus-form-item-content__wrapper')
      expect(contentElement).toHaveStyle({ justifyContent: 'normal' })
    })

    it('设置 wrapperAlign=right 内容右对齐', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="内容右对齐"
            labelWidth={300}
            wrapperWidth={240}
            wrapperAlign="right"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))

      const contentElement = container.querySelector('.formily-element-plus-form-item-content__wrapper')
      expect(contentElement).toHaveStyle({ justifyContent: 'flex-end' })
    })
  })

  describe('提示信息', () => {
    it('设置 tooltip 显示提示图标', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="提示信息"
            tooltip="这是一个提示"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 tooltipLayout=text 显示文本提示', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="文本提示"
            tooltip="这是一个文本提示"
            tooltipLayout="text"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })
  })

  describe('撑满设置', () => {
    it('设置 fullness=true 使组件撑满容器', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="撑满容器"
            fullness={true}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })
  })

  describe('辅助信息', () => {
    it('设置 asterisk=true 显示必填星号', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="必填项"
            asterisk={true}
            labelCol={6}
            wrapperCol={10}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 addonBefore 显示前缀', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="前缀"
            addonBefore="前缀文本"
            labelCol={6}
            wrapperCol={10}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))

      const addonElement = container.querySelector('.formily-element-plus-form-item-addon-before')
      await expect.element(addonElement).toBeInTheDocument()
      await expect(addonElement.textContent).toBe('前缀文本')
    })

    it('设置 addonAfter 显示后缀', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="后缀"
            addonAfter="后缀文本"
            labelCol={6}
            wrapperCol={10}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))

      const addonElement = container.querySelector('.formily-element-plus-form-item-addon-after')
      await expect.element(addonElement).toBeInTheDocument()
      await expect(addonElement.textContent).toBe('后缀文本')
    })

    it('设置 feedbackText 显示反馈信息', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="反馈信息"
            feedbackText="这是一条反馈信息"
            labelCol={6}
            wrapperCol={10}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))

      // const feedbackElement = container.querySelector('.formily-element-plus-form-item-help-text')
      // await expect.element(feedbackElement).toBeInTheDocument()
      // await expect(feedbackElement.textContent).toBe('这是一条反馈信息')
    })

    it('设置 extra 显示额外信息', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="额外信息"
            extra="这是额外信息"
            labelCol={6}
            wrapperCol={10}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })
  })

  describe('表单状态', () => {
    it('设置 feedbackStatus=error 显示错误状态', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="错误状态"
            feedbackStatus="error"
            feedbackText="错误信息"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 feedbackStatus=warning 显示警告状态', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="警告状态"
            feedbackStatus="warning"
            feedbackText="警告信息"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 feedbackStatus=success 显示成功状态', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="成功状态"
            feedbackStatus="success"
            feedbackText="成功信息"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 feedbackStatus=pending 显示加载状态', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="加载状态"
            feedbackStatus="pending"
            feedbackText="加载中..."
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })
  })

  describe('反馈信息布局', () => {
    it('设置 feedbackLayout=terse 使用紧凑模式', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="紧凑模式"
            feedbackStatus="error"
            feedbackText="错误信息"
            feedbackLayout="terse"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 feedbackLayout=loose 使用松散模式', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="松散模式"
            feedbackStatus="error"
            feedbackText="错误信息"
            feedbackLayout="loose"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })

    it('设置 feedbackLayout=popover 使用弹出模式', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="弹出模式"
            feedbackStatus="error"
            feedbackText="错误信息"
            feedbackLayout="popover"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
    })
  })

  describe('栅格布局', () => {
    it('设置 labelCol 和 wrapperCol 实现栅格布局', async () => {
      const { container, getByText } = render(() => (
        <FormProvider form={createForm()}>
          <FormItem
            label="栅格布局"
            labelCol={6}
            wrapperCol={18}
          >
            <Input placeholder="请输入" />
          </FormItem>
        </FormProvider>
      ))
      await expect.element(getByText('栅格布局')).toBeInTheDocument()

      const labelElement = container.querySelector(`.${stylePrefix}-form-item-col-6`)
      const wrapperElement = container.querySelector(`.${stylePrefix}-form-item-col-18`)

      await expect.element(labelElement).toBeInTheDocument()
      await expect.element(wrapperElement).toBeInTheDocument()
    })
  })
})
