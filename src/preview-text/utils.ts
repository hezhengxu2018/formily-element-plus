import type { SpaceProps, TagProps, TextProps } from 'element-plus'
import { inject } from 'vue'

export interface PreviewTextProps {
  placeholder?: string
  tagProps?: Partial<TagProps>
  spaceProps?: Partial<SpaceProps>
  textProps?: Partial<TextProps>
}

export const previewTextConfigKey = Symbol('previewTextConfig')

export function usePreviewConfig() {
  const previewConfig = inject(previewTextConfigKey, {
    placeholder: 'N/A',
    tagProps: { type: 'info' },
    spaceProps: {},
    textProps: {},
  }) as PreviewTextProps
  return {
    placeholder: previewConfig.placeholder,
    tagProps: previewConfig.tagProps,
    spaceProps: previewConfig.spaceProps,
    textProps: previewConfig.textProps,
  }
}
