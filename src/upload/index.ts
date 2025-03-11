import { connect, mapProps } from '@formily/vue'
import FUpload from './upload.vue'

export const Upload = connect(
  FUpload,
  mapProps({ readOnly: 'readonly', value: 'fileList' }),
)

export default Upload
