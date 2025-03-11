<script lang="ts" setup>
import type { Field } from '@formily/core'
import type { ImageViewerInstance, ImageViewerProps, UploadFile, UploadRawFile } from 'element-plus'
import type { PropType } from 'vue'
import {
  Plus as PlusIcon,
  UploadFilled as UploadFilledIcon,
  Upload as UploadIcon,
} from '@element-plus/icons-vue'
import { isFn } from '@formily/shared'
import { useField } from '@formily/vue'
import { ElIcon, ElImageViewer, ElUpload, genFileId } from 'element-plus'
import { computed, ref, useAttrs } from 'vue'

defineOptions({
  name: 'FUpload',
  inheritAttrs: false,
})

const props = defineProps({
  textContent: {
    type: String,
    default: '',
  },
  errorAdaptor: {
    type: Function as PropType<(error?: Error) => string>,
    default: (error?: Error) => error?.message || '',
  },
  fileList: {
    type: Array as PropType<UploadFile[]>,
  },
  imageViewerProps: {
    type: Object as PropType<ImageViewerProps>,
    default: () => {},
  },
})

const emit = defineEmits(['change'])
const uploadRef = ref()
const attrs = useAttrs()
const fieldRef = useField<Field>()

const imgPreviewRef = ref<ImageViewerInstance>()
const activeImageIndex = ref(0)
const isShowImgViewer = ref(false)

const imgPreviewList = computed(() => {
  return props.fileList.map(item => item.url)
})

function setFeedBack(error?: Error) {
  const message = props.errorAdaptor(error)
  fieldRef.value.setFeedback({
    type: 'error',
    code: 'UploadError',
    messages: message ? [message] : [],
  })
}

function handleChange(file: UploadFile, fileList: UploadFile[]) {
  if (isFn(attrs.onChange)) {
    attrs.onChange(file, fileList)
  }
  setFeedBack()
  emit('change', fileList)
}

function handleRemove(file: UploadFile, fileList: UploadFile[]) {
  if (isFn(attrs.onRemove)) {
    attrs.onRemove(file, fileList)
  }
  setFeedBack()
  emit('change', fileList)
}

function handleExceed(files: File[]) {
  if (attrs.limit !== 1)
    return
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
  if (attrs.action !== '#' && attrs.autoUpload) {
    uploadRef.value!.submit()
  }
}

function handleError(error: Error, file: UploadFile, fileList: UploadFile[]) {
  if (isFn(attrs.onError)) {
    (attrs.onError)(error, file, fileList)
  }
  setTimeout(() => {
    setFeedBack(error)
  }, 0)
}

function onPreviewClick(uploadFile: UploadFile) {
  const clickIndex = props.fileList.findIndex((element: UploadFile) => element.uid === uploadFile.uid)
  activeImageIndex.value = clickIndex
  isShowImgViewer.value = true
}
</script>

<template>
  <ElUpload
    ref="uploadRef"
    v-bind="attrs"
    @change="handleChange"
    @remove="handleRemove"
    @exceed="handleExceed"
    @error="handleError"
    @preview="onPreviewClick"
  >
    <slot v-if="$slots.default" />
    <template v-else>
      <template v-if="attrs.drag">
        <ElIcon style="font-size: 60px; margin: 40px 0 16px;">
          <UploadFilledIcon color="gray" />
        </ElIcon>
        <div class="el-upload__text">
          {{ props.textContent }}
        </div>
      </template>
      <template v-else-if="attrs.listType === 'picture-card'">
        <PlusIcon style="width: 28px; height: 28px; color: gray" />
      </template>
      <template v-else>
        <ElButton>
          <UploadIcon width="16px" height="16px" />
          <span style="margin-left: 6px">
            {{ props.textContent }}
          </span>
        </ElButton>
      </template>
    </template>
    <template #file="{ file, index }">
      <slot name="file" :file="file" :index="index" />
    </template>
    <template #tip>
      <slot name="tip" />
    </template>
    <template #trigger>
      <slot name="trigger" />
    </template>
  </ElUpload>
  <ElImageViewer
    v-if="isShowImgViewer"
    ref="imgPreviewRef"
    :url-list="imgPreviewList"
    :initial-index="activeImageIndex"
    show-progress
    teleported
    v-bind="props.imageViewerProps"
    @close="isShowImgViewer = false"
  />
</template>
