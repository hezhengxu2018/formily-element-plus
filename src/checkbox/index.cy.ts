import { createForm } from '@formily/core'
import { defineComponent, h } from 'vue'
import { Field, FormProvider } from '@formily/vue'
import Checkbox from './index'

function formWrapperFactory(customProps) {
  return defineComponent({
    data() {
      return {
        form: createForm(),
      }
    },
    render() {
      return h(FormProvider, { form: this.$data.form }, () => [
        h(Field, {
          name: 'test-checkbox',
          component: [Checkbox.Group],
          ...customProps,
        }),
      ])
    },
  })
}
describe('<Index />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(
      formWrapperFactory({
        dataSource: [
          { label: '选项1', value: 1 },
        ],
      }),
    ).as('formWrapper')
    cy.get('.el-checkbox__input').click()
    cy.get('@formWrapper').vue().should((vueWrapper) => {
      const form = vueWrapper.vm.form
      expect(form.getValuesIn('test-checkbox')[0]).equal(1)
    })
  })
})
