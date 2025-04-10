import type { Form, VoidField } from '@formily/core'
import type { Schema, SchemaKey } from '@formily/json-schema'
import type { PropType } from 'vue'
import { action, model, observable } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import {
  RecursionField,
  useField,
  useFieldSchema,
} from '@formily/vue'
import { ElStep, ElSteps } from 'element-plus'
import { defineComponent, Fragment, h } from 'vue'
import { composeExport, stylePrefix } from '../__builtins__'

export interface IFormStep {
  connect: (steps: SchemaStep[], field: VoidField) => void
  current: number
  allowNext: boolean
  allowBack: boolean
  setCurrent: (key: number) => void
  submit: Form['submit']
  next: () => void
  back: () => void
}

export interface IFormStepProps {
  formStep?: IFormStep
}

interface SchemaStep {
  name: SchemaKey
  props: any
  schema: Schema
}

interface FormStepEnv {
  form: Form
  field: VoidField
  steps: SchemaStep[]
}

function parseSteps(schema: Schema) {
  const steps: SchemaStep[] = []
  schema.mapProperties((schema, name) => {
    if (schema['x-component']?.indexOf('StepPane') > -1) {
      steps.push({
        name,
        props: schema['x-component-props'],
        schema,
      })
    }
  })
  return steps
}

function createFormStep(defaultCurrent = 0): IFormStep {
  const env: FormStepEnv = observable({
    form: null,
    field: null,
    steps: [],
  })

  const setDisplay = action.bound((target: number) => {
    const currentStep = env.steps[target]
    for (const { name } of env.steps) {
      env.form.query(`${env.field.address}.${name}`).take((field) => {
        if (name === currentStep.name) {
          field.setDisplay('visible')
        }
        else {
          field.setDisplay('hidden')
        }
      })
    }
  })

  const formStep: IFormStep = model({
    connect(steps, field) {
      env.steps = steps
      env.form = field?.form
      env.field = field
    },
    current: defaultCurrent,
    setCurrent(key: number) {
      formStep.current = key
    },
    get allowNext() {
      return formStep.current < env.steps.length - 1
    },
    get allowBack() {
      return formStep.current > 0
    },
    async next() {
      try {
        await env.form.validate()
        // eslint-disable-next-line ts/no-use-before-define
        next()
      }
      catch {}
    },
    async back() {
      // eslint-disable-next-line ts/no-use-before-define
      back()
    },
    async submit(onSubmit) {
      return env.form?.submit?.(onSubmit)
    },
  })

  const next = action.bound(() => {
    if (formStep.allowNext) {
      setDisplay(formStep.current + 1)
      formStep.setCurrent(formStep.current + 1)
    }
  })

  const back = action.bound(() => {
    if (formStep.allowBack) {
      setDisplay(formStep.current - 1)
      formStep.setCurrent(formStep.current - 1)
    }
  })
  return formStep
}

function renderSteps(steps: SchemaStep[], callback) {
  return steps.map((element, index) => callback(element, index))
}
const FormStepInner = observer(
  defineComponent({
    name: 'FFormStep',
    props: {
      formStep: {
        type: Object as PropType<IFormStep>,
        default() {
          return {
            current: 0,
          }
        },
      },
    },
    setup(props: any, { attrs }) {
      const field = useField<VoidField>().value
      const prefixCls = `${stylePrefix}-form-step`
      const fieldSchemaRef = useFieldSchema()

      const steps = parseSteps(fieldSchemaRef.value)

      props.formStep.connect?.(steps, field)

      return () => {
        const current = props.active || props.formStep?.current || 0
        return h(
          'div',
          {
            class: [prefixCls],
          },
          {
            default: () => [
              h(
                ElSteps,
                {
                  ...attrs,
                  active: current,
                  style: [{ marginBottom: '10px' }, attrs.style],
                },
                {
                  default: () =>
                    renderSteps(steps, ({ props }, key) => {
                      return h(ElStep, { props, key }, {})
                    }),
                },
              ),

              renderSteps(steps, ({ name, schema }, key) => {
                if (key !== current)
                  return
                return h(RecursionField, { name, schema, key }, {})
              }),
            ],
          },
        )
      }
    },
  }),
)

const StepPane = defineComponent({
  name: 'FFormStepPane',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h(Fragment, slots.default?.())
  },
})

export const FormStep = composeExport(FormStepInner, {
  StepPane,
  createFormStep,
})

export default FormStep
