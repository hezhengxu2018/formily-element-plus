import { createForm } from '@formily/core'
import { FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import FormLayout from '../index'
import { useFormLayout } from '../utils'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-form.css'

describe('form-layout 组件', () => {
  describe('基础功能', () => {
    it('正常渲染', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout>
            <div data-testid="content">表单内容</div>
          </FormLayout>
        </FormProvider>
      ))

      await expect.element(container.querySelector('.formily-element-form')).toBeInTheDocument()
      await expect.element(container.querySelector('[data-testid="content"]')).toBeInTheDocument()
    })

    it('支持不同布局模式', async () => {
      const { container } = render(() => (
        <FormProvider form={createForm()}>
          <FormLayout layout="vertical">
            {{
              default: () => {
                const formLayout = useFormLayout()
                return (
                  <div data-testid="layout-value">{formLayout.value.layout}</div>
                )
              },
            }}
          </FormLayout>
        </FormProvider>
      ))

      await expect.element(container.querySelector('[data-testid="layout-value"]')).toHaveTextContent('vertical')
    })
  })

  // describe('属性传递', () => {
  //   it('支持设置 colon', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout colon={false}>
  //           {{
  //             default: () => {
  //               const formLayout = useFormLayout()
  //               return (
  //                 <div data-testid="colon-value">{String(formLayout.value.colon)}</div>
  //               )
  //             },
  //           }}
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="colon-value"]')).toHaveTextContent('false')
  //   })

  //   it('支持设置 labelWidth', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout labelWidth="120px">
  //           {{
  //             default: () => {
  //               const formLayout = useFormLayout()
  //               return (
  //                 <div data-testid="label-width-value">{formLayout.value.labelWidth}</div>
  //               )
  //             },
  //           }}
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="label-width-value"]')).toHaveTextContent('120px')
  //   })

  //   it('支持设置 size', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout size="small">
  //           {{
  //             default: () => {
  //               const formLayout = useFormLayout()
  //               return (
  //                 <div data-testid="size-value">{formLayout.value.size}</div>
  //               )
  //             },
  //           }}
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="size-value"]')).toHaveTextContent('small')
  //   })
  // })

  // describe('嵌套布局', () => {
  //   it('支持嵌套 FormLayout 并使用 shallow', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout layout="horizontal" labelWidth="100px">
  //           <FormLayout layout="vertical" shallow>
  //             {{
  //               default: () => {
  //                 const formLayout = useFormLayout()
  //                 return (
  //                   <div>
  //                     <div data-testid="nested-layout">{formLayout.value.layout}</div>
  //                     <div data-testid="nested-label-width">{formLayout.value.labelWidth}</div>
  //                   </div>
  //                 )
  //               },
  //             }}
  //           </FormLayout>
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="nested-layout"]')).toHaveTextContent('vertical')
  //     await expect.element(container.querySelector('[data-testid="nested-label-width"]')).toHaveTextContent('100px')
  //   })

  //   it('支持嵌套 FormLayout 并使用 non-shallow', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout layout="horizontal" labelWidth="100px">
  //           <FormLayout layout="vertical" shallow={false}>
  //             {{
  //               default: () => {
  //                 const formLayout = useFormLayout()
  //                 return (
  //                   <div>
  //                     <div data-testid="nested-layout">{formLayout.value.layout}</div>
  //                     <div data-testid="nested-label-width">{formLayout.value.labelWidth}</div>
  //                   </div>
  //                 )
  //               },
  //             }}
  //           </FormLayout>
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="nested-layout"]')).toHaveTextContent('vertical')
  //     // 非shallow模式下，内部布局会覆盖外部布局的属性
  //     await expect.element(container.querySelector('[data-testid="nested-label-width"]')).not.toHaveTextContent('100px')
  //   })
  // })

  // describe('栅格布局', () => {
  //   it('支持设置 labelCol 和 wrapperCol', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout labelCol={6} wrapperCol={18}>
  //           {{
  //             default: () => {
  //               const formLayout = useFormLayout()
  //               return (
  //                 <div>
  //                   <div data-testid="label-col">{formLayout.value.labelCol}</div>
  //                   <div data-testid="wrapper-col">{formLayout.value.wrapperCol}</div>
  //                 </div>
  //               )
  //             },
  //           }}
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="label-col"]')).toHaveTextContent('6')
  //     await expect.element(container.querySelector('[data-testid="wrapper-col"]')).toHaveTextContent('18')
  //   })
  // })

  // describe('反馈布局', () => {
  //   it('支持设置 feedbackLayout', async () => {
  //     const { container } = render(() => (
  //       <FormProvider form={createForm()}>
  //         <FormLayout feedbackLayout="loose">
  //           {{
  //             default: () => {
  //               const formLayout = useFormLayout()
  //               return (
  //                 <div data-testid="feedback-layout">{formLayout.value.feedbackLayout}</div>
  //               )
  //             },
  //           }}
  //         </FormLayout>
  //       </FormProvider>
  //     ))

  //     await expect.element(container.querySelector('[data-testid="feedback-layout"]')).toHaveTextContent('loose')
  //   })
  // })
})
