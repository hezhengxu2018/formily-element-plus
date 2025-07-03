import { connect, mapProps } from '@formily/vue'
import InnerTree from './tree.vue'

const Tree = connect(
  InnerTree,
  mapProps({ dataSource: 'data', loading: 'loading' }),
)

export { Tree }

export default Tree
