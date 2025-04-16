import type { Form } from '@formily/core'
import { reaction } from '@formily/reactive'
import { useDebounceFn } from '@vueuse/core'
import { ElLoading } from 'element-plus'
import { ref } from 'vue'

export async function loading(loadingText = 'Loading...', processor: () => Promise<any>) {
  let loadingInstance
  const loading = setTimeout(() => {
    loadingInstance = ElLoading.service({
      text: loadingText,
      background: 'transparent',
    })
  }, 100)
  try {
    return await processor()
  }
  finally {
    loadingInstance?.close()
    clearTimeout(loading)
  }
}

export function useDebonceSubmitting(form: Form) {
  const internalSubmitting = ref(false)
  const transitionDuration = ref(200)

  const cssVar = getComputedStyle(document.documentElement)
    .getPropertyValue('--el-transition-duration')

  const durationMatch = cssVar.match(/([\d.]+)([ms|]*)/)
  if (durationMatch) {
    const value = Number.parseFloat(durationMatch[1])
    const unit = durationMatch[2]
    transitionDuration.value = unit === 's' ? value * 1000 : value
  }

  const setSubmittingFalse = useDebounceFn(() => {
    internalSubmitting.value = false
  }, () => transitionDuration.value)

  reaction(() => form.submitting, (val) => {
    if (val === false) {
      setSubmittingFalse()
    }
    else {
      internalSubmitting.value = val
    }
  })

  return {
    internalSubmitting,
  }
}
