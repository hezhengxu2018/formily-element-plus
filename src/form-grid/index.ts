import type { IGridOptions } from '@formily/grid'
import type {
  ComponentInternalInstance,
  InjectionKey,
  PropType,
  Ref,
} from 'vue'
import { Grid } from '@formily/grid'
import { markRaw } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  onMounted,
  provide,
  watchEffect,
} from 'vue'
import { composeExport, stylePrefix } from '../__builtins__'
import { useFormLayout } from '../form-layout'
import './style.scss'

export interface IFormGridProps extends IGridOptions {
  grid?: Grid<HTMLElement>
  prefixCls?: string
  className?: string
}

const FormGridSymbol: InjectionKey<Ref<Grid<HTMLElement>>>
  = Symbol('FormGridContext')

interface GridColumnProps {
  gridSpan: number
}

export function createFormGrid(props: IFormGridProps): Grid<HTMLElement> {
  return markRaw(new Grid(props))
}

export const useFormGrid = (): Ref<Grid<HTMLElement>> => inject(FormGridSymbol)

/**
 * @deprecated
 */
function useGridSpan(gridSpan: number) {
  return gridSpan
}

/**
 * @deprecated
 */
export function useGridColumn(gridSpan = 'span 1') {
  return gridSpan
}

function useRefs(): Record<string, unknown> {
  const vm: ComponentInternalInstance | null = getCurrentInstance()
  return vm?.refs || {}
}

const FormGridInner = observer(
  defineComponent({
    name: 'FFormGrid',
    props: {
      columnGap: {
        type: Number,
      },
      rowGap: {
        type: Number,
      },
      minColumns: {
        type: [Number, Array],
      },
      minWidth: {
        type: [Number, Array],
      },
      maxColumns: {
        type: [Number, Array],
      },
      maxWidth: {
        type: [Number, Array],
      },
      breakpoints: {
        type: Array,
      },
      colWrap: {
        type: Boolean,
        default: true,
      },
      strictAutoFit: {
        type: Boolean,
        default: false,
      },
      shouldVisible: {
        type: Function as PropType<IGridOptions['shouldVisible']>,
        default() {
          return () => true
        },
      },
      grid: {
        type: Object as PropType<Grid<HTMLElement>>,
      },
    },
    setup(props: any, { slots }) {
      const layout = useFormLayout()

      const gridInstance = computed(() => {
        const newProps: IFormGridProps = {}
        for (const key of Object.keys(props)) {
          if (props[key] !== undefined) {
            newProps[key] = props[key]
          }
        }
        const options = {
          columnGap: layout.value?.gridColumnGap ?? 8,
          rowGap: layout.value?.gridRowGap ?? 4,
          ...newProps,
        }
        return markRaw(options?.grid ?? new Grid(options))
      })
      const prefixCls = `${stylePrefix}-form-grid`

      provide(FormGridSymbol, gridInstance)

      onMounted(() => {
        const refs = useRefs()
        watchEffect((onInvalidate) => {
          const dispose = gridInstance.value.connect(refs.root as HTMLElement)
          onInvalidate(() => {
            dispose()
          })
        })
      })

      return () => {
        return h(
          'div',
          {
            class: `${prefixCls}`,
            style: {
              gridTemplateColumns: gridInstance.value.templateColumns,
              gap: gridInstance.value.gap,
            },
            ref: 'root',
          },
          slots,
        )
      }
    },
  }),
) as any

const FormGridColumn = observer(
  defineComponent({
    name: 'FFormGridColumn',
    props: {
      gridSpan: {
        type: Number,
        default: 1,
      },
    },
    setup(props: GridColumnProps, { slots }) {
      return () => {
        return h(
          'div',
          {
            'data-grid-span': props.gridSpan,
          },
          slots,
        )
      }
    },
  }),
)

export const FormGrid = composeExport(FormGridInner, {
  GridColumn: FormGridColumn,
  useGridSpan,
  useFormGrid,
  createFormGrid,
})

export default FormGrid
