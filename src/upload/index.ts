import type { Field } from '@formily/core'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload'
import {
  Plus,
  UploadFilled,
  Upload as UploadIcon,
} from '@element-plus/icons-vue'
import { isFn } from '@formily/shared'
import { connect, FragmentComponent, mapProps, useField } from '@formily/vue'
import { ElButton, ElIcon, ElUpload, genFileId } from 'element-plus'
import { defineComponent, h, ref } from 'vue'

export type UploadProps = typeof ElUpload & {
  textContent?: string
  errorAdaptor?: (error?: ErrorEvent) => string
}

const UploadWrapper = defineComponent({
  name: 'FUpload',
  props: {
    textContent: {
      type: String,
      default: '',
    },
    errorAdaptor: {
      type: Function,
      default(error?: ErrorEvent) {
        return error?.message || ''
      },
    },
    fileList: {
      type: Array,
    },
  },
  emits: ['change'],
  setup(curProps, { slots, attrs, emit }) {
    const uploadRef = ref()

    return () => {
      const fieldRef = useField<Field>()

      const setFeedBack = (error?: ErrorEvent) => {
        const message = curProps.errorAdaptor(error)

        fieldRef.value.setFeedback({
          type: 'error',
          code: 'UploadError',
          messages: message ? [message] : [],
        })
      }
      const props = {
        ...attrs,
        onChange(file: UploadFile, fileList: UploadFile[]) {
          if (isFn(attrs.onChange)) {
            attrs.onChange(file, fileList)
          }
          setFeedBack()
          emit('change', fileList)
        },

        onRemove(file: UploadFile, fileList: UploadFile[]) {
          if (isFn(attrs.onRemove)) {
            attrs.onRemove(file, fileList)
          }
          setFeedBack()
          emit('change', fileList)
        },

        onExceed(files) {
          uploadRef.value!.clearFiles()
          const file = files[0]
          file.uid = genFileId()
          uploadRef.value!.handleStart(file)
        },

        onError(error: ErrorEvent, file: UploadFile, fileList: UploadFile[]) {
          if (isFn(attrs.onError)) {
            attrs.onError(error, file, fileList)
          }
          setTimeout(() => {
            setFeedBack(error)
          }, 0)
        },
      }
      const children = {
        ...slots,
      } as any
      if (!slots.default) {
        children.default = () => {
          const listType = attrs.listType
          const drag = attrs.drag

          if (drag) {
            return h(
              FragmentComponent,
              {},
              {
                default: () => [
                  h(
                    ElIcon,
                    { style: { fontSize: '60px', margin: '40px 0 16px' } },
                    { default: () => h(UploadFilled, { color: 'gray' }, {}) },
                  ),
                  h(
                    'div',
                    { staticClass: 'el-upload__text' },
                    { default: () => [curProps.textContent] },
                  ),
                ],
              },
            )
          }

          if (listType === 'picture-card') {
            return h(
              Plus,
              {
                style: {
                  width: '28px',
                  height: '28px',
                  marginTop: '60px',
                  color: 'gray',
                },
              },
              {},
            )
          }

          return h(
            ElButton,
            {},
            {
              default: () => [
                h(UploadIcon, { style: { width: '12px', height: '12px' } }),
                curProps.textContent,
              ],
            },
          )
        }
      }
      return h(
        ElUpload as any,
        { ref: uploadRef, ...props, ...attrs },
        children,
      )
    }
  },
})

export const Upload = connect(
  UploadWrapper,
  mapProps({ readOnly: 'readonly', value: 'fileList' }),
)

export default Upload
