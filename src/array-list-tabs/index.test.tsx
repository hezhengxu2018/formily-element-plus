/*
 * @Author: Hezhengxu
 * @Date: 2024-11-19 09:52:46
 * @LastEditors: Hezhengxu
 * @Description:
 */
import { defineComponent, h } from 'vue'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import { Close } from '@element-plus/icons-vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { ArrayListTabs, FormItem, Input } from '../index'
import './style'
import 'element-plus/theme-chalk/src/input.scss'

export const ArrayListTabsTest = defineComponent({
  name: 'TestComponent',
  setup(_props) {
    const {
      SchemaField,
      SchemaArrayField,
      SchemaObjectField,
      SchemaStringField,
      SchemaVoidField,
    } = createSchemaField({
      components: {
        FormItem,
        Input,
        ArrayListTabs,
      },
    })
    const form = createForm()
    return () =>
      h(FormProvider, { form }, () =>
        h(SchemaField, {}, () =>
          h(
            SchemaArrayField,
            {
              'name': 'array',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayListTabs',
              'x-component-props': {
                tabTitleField: 'input',
              },
              'x-validator': {
                max: 5,
              },
            },
            () => [
              h(
                SchemaObjectField,
                {},
                () => [
                  h(SchemaStringField, {
                    'name': 'input',
                    'x-decorator': 'FormItem',
                    'title': 'input',
                    'x-component': 'Input',
                    'x-validator': [{ required: true }],
                  }),
                  h(SchemaStringField, {
                    'name': 'input2',
                    'x-decorator': 'FormItem',
                    'title': 'input2',
                    'x-component': 'Input',
                  }),
                  h(SchemaVoidField, {
                    'x-component': 'ArrayListTabs.Remove',
                    'x-component-props': {
                      icon: Close,
                    },
                  }),
                ],
              ),
              h(SchemaVoidField, {
                'x-component': 'ArrayListTabs.Addition',
                'title': '添加条目',
              }),
            ],
          )))
  },
})

describe('arrayListTabs', async () => {
  it('基础交互', async () => {
    const screen = render(ArrayListTabsTest)
    await expect.element(screen.getByText('No Data')).toBeInTheDocument()
  })
})
