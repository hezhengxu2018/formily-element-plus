/* eslint-disable unicorn/consistent-function-scoping */
import type { ArrayField } from '@formily/core'
import type { UploadFiles } from 'element-plus'
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Upload } from '../index'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-upload.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-icon.css'
import 'element-plus/theme-chalk/el-image-viewer.css'

describe('upload 组件', () => {
  describe('基础功能', async () => {
    it('正常渲染', async () => {
      const { getByRole } = render(() => (
        <Upload action="#" textContent="上传" />
      ))
      await expect.element(getByRole('button')).toBeInTheDocument()
    })

    it('支持自定义文本内容', async () => {
      const { getByText } = render(() => (
        <Upload action="#" textContent="上传文件" />
      ))
      await expect.element(getByText('上传文件')).toBeInTheDocument()
    })

    it('支持拖拽上传模式', async () => {
      const { container } = render(() => (
        <Upload action="#" drag textContent="拖拽上传" />
      ))
      await expect.element(container.querySelector('.el-upload-dragger')).toBeInTheDocument()
      await expect.element(container.querySelector('.el-upload__text')).toHaveTextContent('拖拽上传')
    })

    it('支持卡片上传模式', async () => {
      const { container } = render(() => (
        <Upload action="#" listType="picture-card" />
      ))
      await expect.element(container.querySelector('.el-upload--picture-card')).toBeInTheDocument()
    })
  })

  describe('表单交互', async () => {
    it('上传文件后表单的值应该经过formatValue的转化', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const file2 = new File(['file2'], 'file2.png', { type: 'image/png' })
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })

      const mockFormatValue = vi.fn((fileList: UploadFiles) => fileList.map(file => file.response))

      const { container } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              httpRequest,
              textContent: '上传文件',
              autoUpload: true,
              formatValue: mockFormatValue,
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      expect(httpRequest).toHaveBeenCalled()
      expect(form.values.upload).toEqual(['http://example.com/file.png'])
      await userEvent.upload(input, file2)
      expect(form.values.upload).toEqual(['http://example.com/file.png', 'http://example.com/file2.png'])
    })

    it('limit = 1时新选择的值应该替换原有文件', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const file2 = new File(['file2'], 'file2.png', { type: 'image/png' })
      // 模拟自定义上传请求函数，直接返回成功
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })

      const { container } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              httpRequest,
              textContent: '上传文件',
              autoUpload: true,
              limit: 1,
              formatValue: (fileList: UploadFiles) => fileList.map(file => file.response),
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      expect(httpRequest).toHaveBeenCalled()
      expect(form.values.upload).toEqual(['http://example.com/file.png'])
      await userEvent.upload(input, file2)
      expect(form.values.upload).toEqual(['http://example.com/file2.png'])
    })

    it('关闭自动上传时表单的值应该经过formatValue的转化', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const file2 = new File(['file2'], 'file2.png', { type: 'image/png' })
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })
      const mockFormatValue = vi.fn((fileList: UploadFiles) => fileList.map(file => file.raw.name))
      const { container } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              httpRequest,
              textContent: '上传文件',
              autoUpload: false,
              formatValue: mockFormatValue,
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      expect(httpRequest).not.toHaveBeenCalled()
      expect(form.values.upload).toEqual(['file.png'])
      await userEvent.upload(input, file2)
      expect(form.values.upload).toEqual(['file.png', 'file2.png'])
    })
  })

  describe('事件触发', () => {
    it('on Error', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const httpRequest = async () => {
        throw new Error('上传失败')
      }

      const mockFormatValue = vi.fn((fileList: UploadFiles) => fileList.map(file => file.response))
      const mockOnError = vi.fn((error) => {
        console.log(error)
      })

      const { container } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              textContent: '上传文件',
              httpRequest,
              autoUpload: true,
              formatValue: mockFormatValue,
              onError: mockOnError,
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      expect(mockOnError).toHaveBeenCalled()
      expect(mockFormatValue).toHaveBeenCalled()
    })

    it('on Exceed', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const file2 = new File(['file2'], 'file2.png', { type: 'image/png' })
      const file3 = new File(['file3'], 'file3.png', { type: 'image/png' })
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })

      const mockExceed = vi.fn()

      const { container } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              textContent: '上传文件',
              httpRequest,
              limit: 2,
              autoUpload: true,
              onExceed: mockExceed,
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      await userEvent.upload(input, file2)
      expect(mockExceed).not.toHaveBeenCalled()
      await userEvent.upload(input, file3)
      expect(mockExceed).toHaveBeenCalledOnce()
    })

    it('on Remove', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const file2 = new File(['file2'], 'file2.png', { type: 'image/png' })
      const file3 = new File(['file3'], 'file3.png', { type: 'image/png' })
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })

      const mockRemove = vi.fn()

      const { container, getByText } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              textContent: '上传文件',
              httpRequest,
              autoUpload: true,
              onRemove: mockRemove,
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      await userEvent.upload(input, file2)
      await userEvent.upload(input, file3)
      await expect.element(getByText('file3')).toBeInTheDocument()
      await getByText('file3').hover()
      const IconClose3 = getByText('file3').element().parentElement.parentElement.parentElement.querySelector('.el-icon--close')
      expect(IconClose3).toBeVisible()
      await userEvent.click(IconClose3)
      expect(mockRemove).toHaveBeenCalledOnce()
    })

    it('on Preview', async () => {
      const form = createForm()
      const file = new File(['file'], 'file.text', { type: 'palin/text' })
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })
      const mockPreview = vi.fn()

      const { container, getByText } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              textContent: '上传文件',
              httpRequest,
              autoUpload: true,
              onPreview: mockPreview,
            }]}
          />
        </FormProvider>
      ))
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      await expect.element(getByText('file')).toBeInTheDocument()
      await getByText('file').click()
      expect(mockPreview).toHaveBeenCalledOnce()
    })
  })

  describe('插槽功能', async () => {
    it('支持默认插槽', async () => {
      const { getByText } = render(() => (
        <Upload action="#">
          <div>自定义上传按钮</div>
        </Upload>
      ))
  
      await expect.element(getByText('自定义上传按钮')).toBeInTheDocument()
    })
  
    it('支持tip插槽', async () => {
      const { getByText } = render(() => (
        <Upload action="#">
          {{
            tip: () => <div>上传提示信息</div>,
          }}
        </Upload>
      ))
  
      await expect.element(getByText('上传提示信息')).toBeInTheDocument()
    })

    it('支持trigger插槽', async () => {
      const { getByText } = render(() => (
        <Upload action="#" >
          {{
            trigger: () => <div>trigger的内容</div>,
            default: () => <div>默认的内容</div>,
          }}
        </Upload>
      ))
  
      await expect.element(getByText('trigger的内容')).toBeInTheDocument()
      await expect.element(getByText('默认的内容')).toBeInTheDocument()
    })

    it('支持file插槽', async () => {
      const { container, getByText } = render(() => (
        <Upload action="#" >
          {{
            file: ({file, index}) => {
              return <div>{`${file.name}-${index}`}</div>
            },
            default: () => <div>默认的内容</div>,
          }}
        </Upload>
      ))
      const file = new File(['file'], 'file.png', { type: 'image/png' })
      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      await expect.element(getByText('file.png-0')).toBeInTheDocument()
      await expect.element(getByText('默认的内容')).toBeInTheDocument()
    })
  })

  describe('组件封装新增交互', async () => {
    it('当文件类型是图片时默认支持图片预览', async () => {
      const form = createForm()
      const httpRequest = vi.fn().mockImplementation(async (options) => {
        return `http://example.com/${options.file.name}`
      })

      const file = new File(['file'], 'file.png', { type: 'image/png' })

      const { container, getByText } = render(() => (
        <FormProvider form={form}>
          <Field
            name="upload"
            component={[Upload, {
              action: '#',
              httpRequest,
              textContent: '上传文件',
              autoUpload: true,
              accept: 'image/*',
            }]}
          />
        </FormProvider>
      ))

      const input = container.querySelector('input')
      await userEvent.upload(input, file)
      await expect.element(getByText('file.png')).toBeInTheDocument()
      await getByText('file.png').click()
      await expect.element(document.querySelector('.el-image-viewer__wrapper')).toBeInTheDocument()
      await userEvent.keyboard('{Escape}')
      expect(document.querySelector('.el-image-viewer__wrapper')).toBeNull()
    })
  })
})



// describe('图片预览功能', async () => {
//   it('支持图片预览', async () => {
//     const form = createForm()
//     const mockFileList = [{
//       name: 'test.png',
//       url: 'http://example.com/test.png',
//       status: 'success',
//       uid: '1',
//     }]

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//             accept: 'image/*',
//             fileList: mockFileList,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 模拟点击预览
//     const previewElement = container.querySelector('.el-upload-list__item-preview')
//     if (previewElement) {
//       await previewElement.click()

//       // 检查图片预览器是否显示
//       await expect.element(document.querySelector('.el-image-viewer__wrapper')).toBeInTheDocument()
//     }
//   })

//   it('支持自定义预览行为', async () => {
//     const form = createForm()
//     const onPreview = vi.fn()
//     const mockFileList = [{
//       name: 'test.png',
//       url: 'http://example.com/test.png',
//       status: 'success',
//       uid: '1',
//     }]

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//             accept: 'image/*',
//             fileList: mockFileList,
//             onPreview,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 模拟点击预览
//     const previewElement = container.querySelector('.el-upload-list__item-preview')
//     if (previewElement) {
//       await previewElement.click()

//       expect(onPreview).toHaveBeenCalled()
//       // 自定义预览时不应显示内置预览器
//       expect(document.querySelector('.el-image-viewer__wrapper')).toBeNull()
//     }
//   })
// })



// describe('特殊交互', async () => {
//   it('limit为1时自动替换文件', async () => {
//     const form = createForm()
//     const mockFiles = [new File(['content'], 'new.png', { type: 'image/png' })]
//     const mockUploadFiles = []

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//             limit: 1,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 获取上传实例
//     const uploadInstance = form.query('upload').take()
//     const uploadRef = {
//       clearFiles: vi.fn(),
//       handleStart: vi.fn(),
//       submit: vi.fn(),
//     }

//     // 模拟上传组件引用
//     uploadInstance.componentProps.uploadRef = uploadRef

//     // 触发超出限制处理函数
//     uploadInstance.componentProps.onExceed(mockFiles, mockUploadFiles)

//     expect(uploadRef.clearFiles).toHaveBeenCalled()
//     expect(uploadRef.handleStart).toHaveBeenCalled()
//     expect(uploadRef.submit).toHaveBeenCalled()
//   })

//   it('上传异常时不应包含失败文件且显示错误', async () => {
//     const form = createForm()
//     const mockError = new Error('网络错误')
//     const mockFailedFile = {
//       name: 'failed.png',
//       status: 'error',
//       uid: '2',
//     }

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 获取上传实例
//     const uploadInstance = form.query('upload').take()

//     // 模拟上传错误
//     uploadInstance.componentProps.onChange(mockFailedFile, [mockFailedFile])
//     uploadInstance.componentProps.onError(mockError, mockFailedFile, [mockFailedFile])

//     // 等待异步操作完成
//     await new Promise(resolve => setTimeout(resolve, 10))

//     // 检查表单值不应包含失败文件
//     expect(form.values.upload).toEqual([mockFailedFile])

//     // 检查是否显示错误信息
//     const feedback = uploadInstance.getFeedback()
//     expect(feedback.find(item => item.code === 'UploadError')).toBeTruthy()
//   })

//   it('支持部分反显部分新增的混合场景', async () => {
//     const form = createForm()
//     // 模拟已有文件（反显）
//     const existingFile = {
//       name: 'existing.jpg',
//       url: 'http://example.com/existing.jpg',
//       status: 'success',
//       uid: '3',
//     }
//     // 模拟新上传文件
//     const newFile = {
//       name: 'new.jpg',
//       url: 'http://example.com/new.jpg',
//       status: 'success',
//       uid: '4',
//     }

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//             fileList: [existingFile], // 初始化反显文件
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 获取上传实例
//     const uploadInstance = form.query('upload').take()

//     // 检查初始值
//     expect(form.values.upload).toEqual([existingFile])

//     // 模拟添加新文件
//     uploadInstance.componentProps.onChange(
//       newFile,
//       [existingFile, newFile],
//     )

//     // 检查最终值包含所有文件
//     expect(form.values.upload).toEqual([existingFile, newFile])
//   })

//   it('支持自定义格式化反显和新增的混合场景', async () => {
//     const form = createForm()
//     // 自定义格式化函数，只保留URL
//     const formatValue = fileList => fileList.map(file => file.url)

//     // 模拟已有文件（反显）
//     const existingFile = {
//       name: 'existing.jpg',
//       url: 'http://example.com/existing.jpg',
//       status: 'success',
//       uid: '5',
//     }
//     // 模拟新上传文件
//     const newFile = {
//       name: 'new.jpg',
//       url: 'http://example.com/new.jpg',
//       status: 'success',
//       uid: '6',
//     }

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//             fileList: [existingFile], // 初始化反显文件
//             formatValue,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 获取上传实例
//     const uploadInstance = form.query('upload').take()

//     // 检查初始值
//     expect(form.values.upload).toEqual(['http://example.com/existing.jpg'])

//     // 模拟添加新文件
//     uploadInstance.componentProps.onChange(
//       newFile,
//       [existingFile, newFile],
//     )

//     // 检查最终值是格式化后的URL数组
//     expect(form.values.upload).toEqual([
//       'http://example.com/existing.jpg',
//       'http://example.com/new.jpg',
//     ])
//   })

//   it('支持预上传和非预上传模式的不同触发时机', async () => {
//     // 测试预上传模式（action 不为 # 的情况）
//     const preUploadForm = createForm()
//     const preUploadChangeSpy = vi.fn()

//     const mockFile = {
//       name: 'test.jpg',
//       status: 'success',
//       uid: '7',
//       response: { url: 'http://example.com/test.jpg' },
//     }

//     render(() => (
//       <FormProvider form={preUploadForm}>
//         <Field
//           name="preUpload"
//           component={[Upload, {
//             action: 'https://example.com/upload',
//             onChange: preUploadChangeSpy,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 获取上传实例
//     const preUploadInstance = preUploadForm.query('preUpload').take()

//     // 模拟文件上传完成，触发 response 变化
//     preUploadInstance.setDataSource([mockFile])

//     // 检查是否触发了 onChange
//     expect(preUploadChangeSpy).toHaveBeenCalled()

//     // 测试非预上传模式（action 为 # 的情况）
//     const nonPreUploadForm = createForm()
//     const nonPreUploadChangeSpy = vi.fn()

//     const mockLocalFile = {
//       name: 'local.jpg',
//       status: 'ready', // 状态变化而非 response 变化
//       uid: '8',
//     }

//     render(() => (
//       <FormProvider form={nonPreUploadForm}>
//         <Field
//           name="nonPreUpload"
//           component={[Upload, {
//             action: '#',
//             onChange: nonPreUploadChangeSpy,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 获取上传实例
//     const nonPreUploadInstance = nonPreUploadForm.query('nonPreUpload').take()

//     // 模拟文件选择，触发 status 变化
//     nonPreUploadInstance.setDataSource([mockLocalFile])

//     // 检查是否触发了 onChange
//     expect(nonPreUploadChangeSpy).toHaveBeenCalled()
//   })

//   it('支持图片预览器的自定义配置', async () => {
//     const form = createForm()
//     const mockFileList = [{
//       name: 'test.png',
//       url: 'http://example.com/test.png',
//       status: 'success',
//       uid: '9',
//     }]

//     // 自定义图片预览器配置
//     const imageViewerProps = {
//       zIndex: 3000,
//       initialIndex: 0,
//       infinite: false,
//     }

//     const { container } = render(() => (
//       <FormProvider form={form}>
//         <Field
//           name="upload"
//           component={[Upload, {
//             action: '#',
//             accept: 'image/*',
//             fileList: mockFileList,
//             imageViewerProps,
//           }]}
//         />
//       </FormProvider>
//     ))

//     // 模拟点击预览
//     const previewElement = container.querySelector('.el-upload-list__item-preview')
//     if (previewElement) {
//       await previewElement.click()

//       // 检查图片预览器是否显示并应用了自定义配置
//       const imageViewer = document.querySelector('.el-image-viewer__wrapper')
//       expect(imageViewer).toBeInTheDocument()
//       expect(imageViewer.style.zIndex).toBe('3000')
//     }
//   })
// })
