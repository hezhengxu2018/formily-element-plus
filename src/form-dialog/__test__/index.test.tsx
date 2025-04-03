/* eslint-disable unicorn/consistent-function-scoping */
import { createSchemaField } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { ElButton } from 'element-plus'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { FormDialog, FormItem, Input } from '../../'
import 'element-plus/theme-chalk/index.css'

const { SchemaField, SchemaStringField } = createSchemaField({ components: { Input, FormItem } })

describe('FormDialog 组件', () => {
  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('基础功能', () => {
    it('支持打开和关闭对话框', async () => {
      const TestComponent = () => {
        const handleOpen = () => {
          FormDialog('测试标题', () => (
            <div data-testid="dialog-content">对话框内容</div>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开对话框</ElButton>
      }

      const { getByText, getByRole } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })
      await getByText('打开对话框').click()
      await expect.element(getByText('测试标题')).toBeInTheDocument()
      await expect.element(getByText('取消')).toBeInTheDocument()
      await getByText('取消').click()
      expect(document.querySelector('.el-dialog__wrapper')).toBeNull()
      await getByText('打开对话框').click()
      await expect.element(getByRole('button', { name: '确定' })).toBeInTheDocument()
      await getByRole('button', { name: '确定' }).click()
      await getByText('打开对话框').click()
      await expect.element(getByRole('button', { name: 'Close this dialog' })).toBeInTheDocument()
      await getByRole('button', { name: 'Close this dialog' }).click()
      expect(document.querySelector('.el-dialog__wrapper')).toBeNull()
    })
  })

  describe('中间件功能', () => {
    it('支持 forOpen 中间件', async () => {
      const openMiddleware = vi.fn((props, next) => next({ initialValues: { input: 'test' } }))
      const TestComponent = () => {
        const handleOpen = () => {
          FormDialog('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forOpen(openMiddleware)
            .open()
            .catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开对话框</ElButton>
      }

      const { getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })
      await getByText('打开对话框').click()
      expect(openMiddleware).toHaveBeenCalled()
      expect(document.querySelector('input')).toHaveValue('test')
      await getByText('取消').click()
    })

    it('支持 forConfirm 中间件', async () => {
      const forConfirm = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDialog('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forConfirm((form, next) => {
              setTimeout(() => {
                forConfirm(form.values)
                next()
              }, 200)
            })
            .open()
            .catch(console.log)
        }
        return <ElButton onClick={handleOpen}>支持 forConfirm</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await expect.element(container.querySelector('.el-button')).toBeInTheDocument()
      await userEvent.click(container.querySelector('.el-button'))
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      const confirmButton = document.querySelector('.el-button--primary')
      await userEvent.click(confirmButton)
      await expect.element(confirmButton).toHaveClass('is-loading')
      await vi.waitFor(() => {
        expect(forConfirm).toHaveBeenCalled()
        expect(forConfirm).toHaveBeenCalledWith({ input: 'test' })
        expect(document.querySelector('.el-dialog__wrapper')).toBeNull()
      })
    })

    it('支持 forCancel 中间件', async () => {
      const forCancel = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDialog('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forCancel((form, next) => {
              setTimeout(() => {
                forCancel(form.values)
                next()
              }, 200)
            })
            .open()
            .catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开对话框</ElButton>
      }

      const { getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await getByText('打开对话框').click()
      await getByText('取消').click()
      expect(document.querySelector('.el-dialog__wrapper')).toBeNull()
      await vi.waitFor(() => {
        expect(forCancel).toHaveBeenCalled()
      })
    })
  })

  describe('自定义内容', () => {
    it('支持自定义 footer', async () => {
      const forExtra = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDialog('表单对话框', {
            default: () => (
              <SchemaField>
                <SchemaStringField
                  name="input"
                  title="输入框"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{
                    placeholder: '请输入',
                  }}
                  required={true}
                />
              </SchemaField>
            ),
            footer: ({ form, resolve, reject }) => {
              return [
                <ElButton
                  onClick={() => reject()}
                >
                  取消
                </ElButton>,
                <ElButton loading={form.submitting} onClick={() => resolve('extra')}>保存草稿</ElButton>,
                <ElButton
                  type="primary"
                  loading={form.submitting}
                  onClick={() => resolve()}
                >
                  确定
                </ElButton>,
              ]
            },
          }, ['extra']).forExtra((form, next) => {
            forExtra(form.values)
            next()
          }).open().catch(console.log)
        }

        return <ElButton onClick={handleOpen}>打开表单</ElButton>
      }
      const { getByText } = render(() => <TestComponent />)
      await userEvent.click(getByText('打开表单'))
      const input = document.querySelector('input')
      await userEvent.type(input, 'testuser')
      await getByText('保存草稿').click()
      await vi.waitFor(() => {
        expect(forExtra).toHaveBeenCalled()
        expect(forExtra).toHaveBeenCalledWith({ input: 'testuser' })
      })
    })

    it('支持自定义标题', async () => {
      const forCancel = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDialog({ title: '表单对话框', okText: '确认提交', cancelText: '我不想要了' }, {
            default: () => (
              <SchemaField>
                <SchemaStringField
                  name="input"
                  title="输入框"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{
                    placeholder: '请输入',
                  }}
                  required={true}
                />
              </SchemaField>
            ),
            header: ({ reject }) => (
              <div>
                <ElButton onClick={() => reject()}>关闭</ElButton>
                <span>这是标题</span>
              </div>

            ),
          }).forCancel((form, next) => {
            forCancel(form.values)
            next()
          }).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开表单</ElButton>
      }

      const { getByText } = render(() => <TestComponent />)
      await userEvent.click(getByText('打开表单'))
      await expect.element(getByText('这是标题')).toBeInTheDocument()
      await expect.element(getByText('我不想要了')).toBeInTheDocument()
      await expect.element(getByText('确认提交')).toBeInTheDocument()
      await userEvent.click(getByText('关闭'))
      await vi.waitFor(() => {
        expect(forCancel).toHaveBeenCalled()
      })
    })
  })

  describe('异步执行顺序', () => {
    it('弹框打开过程中之后的异步操作会等待表单提交后再执行', async () => {
      const forConfirm = vi.fn()
      const fn1 = vi.fn()
      const TestComponent = () => {
        async function handleOpen() {
          await FormDialog('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forConfirm((form, next) => {
              setTimeout(() => {
                forConfirm(form.values)
                next()
              }, 200)
            })
            .open()
          fn1()
        }
        return <ElButton onClick={handleOpen}>打开对话框</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await expect.element(container.querySelector('.el-button')).toBeInTheDocument()
      await userEvent.click(container.querySelector('.el-button'))
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      const confirmButton = document.querySelector('.el-button--primary')
      expect(fn1).not.toHaveBeenCalled()
      await userEvent.click(confirmButton)
      await expect.element(confirmButton).toHaveClass('is-loading')
      await vi.waitFor(() => {
        expect(forConfirm).toHaveBeenCalled()
        expect(forConfirm).toHaveBeenCalledWith({ input: 'test' })
        expect(document.querySelector('.el-dialog__wrapper')).toBeNull()
        expect(fn1).toHaveBeenCalled()
      })
    })

    it('表单校验失败时弹框不会关闭，表单完成后之后的逻辑会继续执行', async () => {
      const forConfirm = vi.fn()
      const fn1 = vi.fn()
      const TestComponent = () => {
        async function handleOpen() {
          await FormDialog('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forConfirm((form, next) => {
              setTimeout(() => {
                forConfirm(form.values)
                next()
              }, 200)
            })
            .open()
            .catch(console.log)
          fn1()
        }
        return <ElButton onClick={handleOpen}>打开对话框</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await expect.element(container.querySelector('.el-button')).toBeInTheDocument()
      await userEvent.click(container.querySelector('.el-button'))
      const confirmButton = document.querySelector('.el-button--primary')
      expect(fn1).not.toHaveBeenCalled()
      await userEvent.click(confirmButton)
      await expect.element(document.querySelector('.formily-element-plus-form-item-error-help')).toBeInTheDocument()
      await vi.waitFor(() => {
        expect(fn1).not.toHaveBeenCalled()
      })
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      await userEvent.click(confirmButton)
      await vi.waitFor(() => {
        expect(fn1).toHaveBeenCalled()
      })
    })
  })
})
