export interface IFormLayoutProps {
  colon?: boolean
  labelAlign?: 'right' | 'left'
  wrapperAlign?: 'right' | 'left'
  labelWrap?: boolean
  labelWidth?: number
  wrapperWidth?: number
  wrapperWrap?: boolean
  labelCol?: number | number[]
  wrapperCol?: number | number[]
  fullness?: boolean
  size?: 'small' | 'default' | 'large'
  layout?:
    | 'vertical'
    | 'horizontal'
    | 'inline'
    | ('vertical' | 'horizontal' | 'inline')[]
  feedbackLayout?: 'loose' | 'terse' | 'popover'
  tooltipLayout?: 'icon' | 'text'
  breakpoints?: number[]
  spaceGap?: number
  gridColumnGap?: number
  gridRowGap?: number
  shallow?: boolean
  // element-plus form props
  hideRequiredAsterisk?: boolean
  statusIcon?: boolean
}
