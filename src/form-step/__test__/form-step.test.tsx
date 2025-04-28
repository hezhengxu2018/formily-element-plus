import { createForm } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import { createSchemaField, FormProvider } from '@formily/vue'
import { ElButton } from 'element-plus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import { FormButtonGroup, FormItem, FormLayout, FormStep, Input, Submit } from '../../index'
import 'element-plus/theme-chalk/index.css'

describe('FormStep 组件', () => {
  describe('基础功能', () => {
    it('通过 schema 正常渲染', async () => {
      const { SchemaField } = createSchemaField({
        components: {
          FormItem,
          FormStep,
          Input,
        },
      })

      const form = createForm()
      const formStep = FormStep.createFormStep()

      const schema = {
        type: 'object',
        properties: {
          collapse: {
            'type': 'void',
            'x-component': 'FormStep',
            'x-component-props': {
              formStep: '{{formStep}}',
            },
            'properties': {
              step1: {
                'type': 'void',
                'x-component': 'FormStep.StepPane',
                'x-component-props': {
                  title: '第一步',
                },
                'properties': {
                  aaa: {
                    'type': 'string',
                    'title': 'AAA',
                    'required': true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                },
              },
              step2: {
                'type': 'void',
                'x-component': 'FormStep.StepPane',
                'x-component-props': {
                  title: '第二步',
                },
                'properties': {
                  bbb: {
                    'type': 'string',
                    'title': 'BBB',
                    'required': true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                },
              },
            },
          },
        },
      }

      const { container } = render(() => (
        <FormProvider form={form}>
          <FormLayout>
            <SchemaField schema={schema} scope={{ formStep }} />
          </FormLayout>
        </FormProvider>
      ))

      await expect.element(container.querySelector('.formily-element-plus-form-step')).toBeInTheDocument()
      await expect.element(container.querySelector('.el-steps')).toBeInTheDocument()
      await expect.element(container.querySelector('.el-step')).toBeInTheDocument()
      expect(container.querySelectorAll('.el-step').length).toBe(2)
    })

    it('设置默认当前步骤', async () => {
      const { SchemaField } = createSchemaField({
        components: {
          FormItem,
          FormStep,
          Input,
        },
      })

      const form = createForm()
      const formStep = FormStep.createFormStep(1)

      const schema = {
        type: 'object',
        properties: {
          collapse: {
            'type': 'void',
            'x-component': 'FormStep',
            'x-component-props': {
              formStep: '{{formStep}}',
            },
            'properties': {
              step1: {
                'type': 'void',
                'x-component': 'FormStep.StepPane',
                'x-component-props': {
                  title: '第一步',
                },
                'properties': {
                  aaa: {
                    'type': 'string',
                    'title': 'AAA',
                    'required': true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                },
              },
              step2: {
                'type': 'void',
                'x-component': 'FormStep.StepPane',
                'x-component-props': {
                  title: '第二步',
                },
                'properties': {
                  bbb: {
                    'type': 'string',
                    'title': 'BBB',
                    'required': true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  },
                },
              },
            },
          },
        },
      }

      const { getByText } = render(() => (
        <FormProvider form={form}>
          <FormLayout>
            <SchemaField schema={schema} scope={{ formStep }} />
          </FormLayout>
        </FormProvider>
      ))
      await expect.element(getByText('BBB')).toBeVisible()
      expect(formStep.current).toBe(1)
    })

    it('通过按钮控制步骤导航', async () => {
      const submit = vi.fn()
      const { getByRole, getByLabelText } = render(observer(defineComponent({
        setup() {
          const { SchemaField } = createSchemaField({
            components: {
              FormItem,
              FormStep,
              Input,
              FormButtonGroup,
              Submit,
            },
          })

          const form = createForm()
          const formStep = FormStep.createFormStep()

          // 模拟表单字段
          form.createField({
            name: 'aaa',
            required: true,
            value: 'test',
          })

          const schema = {
            type: 'object',
            properties: {
              collapse: {
                'type': 'void',
                'x-component': 'FormStep',
                'x-component-props': {
                  formStep: '{{formStep}}',
                },
                'properties': {
                  step1: {
                    'type': 'void',
                    'x-component': 'FormStep.StepPane',
                    'x-component-props': {
                      title: '第一步',
                    },
                    'properties': {
                      aaa: {
                        'type': 'string',
                        'title': 'AAA',
                        'required': true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                  step2: {
                    'type': 'void',
                    'x-component': 'FormStep.StepPane',
                    'x-component-props': {
                      title: '第二步',
                    },
                    'properties': {
                      bbb: {
                        'type': 'string',
                        'title': 'BBB',
                        'required': true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                    },
                  },
                },
              },
            },
          }

          return () => (
            <FormProvider form={form}>
              <FormLayout>
                <SchemaField schema={schema} scope={{ formStep }} />
                <FormButtonGroup>
                  <ElButton
                    disabled={!formStep.allowBack}
                    onClick={() => formStep.back()}
                  >
                    上一步
                  </ElButton>
                  <ElButton
                    disabled={!formStep.allowNext}
                    onClick={() => {
                      formStep.next()
                    }}
                  >
                    下一步
                  </ElButton>
                  <Submit disabled={formStep.allowNext} onSubmit={submit}>
                    提交
                  </Submit>
                </FormButtonGroup>
              </FormLayout>
            </FormProvider>
          )
        },
      })))

      const backButton = getByRole('button', { name: '上一步' })
      const nextButton = getByRole('button', { name: '下一步' })
      const submitButton = getByRole('button', { name: '提交' })
      await expect.element(backButton).toBeDisabled()

      await nextButton.click()
      await expect.element(backButton).not.toBeDisabled()
      await expect.element(nextButton).toBeDisabled()

      await backButton.click()
      await expect.element(backButton).toBeDisabled()
      await expect.element(nextButton).not.toBeDisabled()
      await nextButton.click()
      await getByLabelText('BBB').fill('test')
      await submitButton.click()
      expect(submit).toBeCalledTimes(1)
    })

    describe('FormStep API', () => {
      let form
      let formStep

      beforeEach(() => {
        form = createForm()
        formStep = FormStep.createFormStep()
      })

      it('setCurrent 方法正确设置当前步骤', () => {
        formStep.setCurrent(1)
        expect(formStep.current).toBe(1)
      })

      it('next 方法正确前进到下一步', async () => {
        vi.spyOn(form, 'validate').mockResolvedValue(null)

        // 模拟连接步骤
        formStep.connect(
          [
            { name: 'step1', props: { title: '第一步' }, schema: {} },
            { name: 'step2', props: { title: '第二步' }, schema: {} },
          ],
          { form, address: 'test' },
        )

        await formStep.next()
        expect(formStep.current).toBe(1)
      })

      it('back 方法正确返回上一步', async () => {
        formStep.setCurrent(1)
        await formStep.back()
        expect(formStep.current).toBe(0)
      })

      it('submit 方法正确提交表单', async () => {
        const submitSpy = vi.spyOn(form, 'submit').mockImplementation(() => {
          return Promise.resolve(form.values)
        })

        const mockCallback = vi.fn()
        formStep.connect(
          [
            { name: 'step1', props: { title: '第一步' }, schema: {} },
            { name: 'step2', props: { title: '第二步' }, schema: {} },
          ],
          { form, address: 'test' },
        )
        await formStep.submit(mockCallback)
        expect(submitSpy).toHaveBeenCalled()
      })
    })
  })
})
