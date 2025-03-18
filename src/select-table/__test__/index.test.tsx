import type { ArrayField, FieldDataSource } from '@formily/core'
import { createForm } from '@formily/core'
import { createSchemaField, Field, FormProvider } from '@formily/vue'
import { ElTableColumn } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, Fragment } from 'vue'
import SelectTable from '../index'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-table.css'
import 'element-plus/theme-chalk/el-link.css'
import 'element-plus/theme-chalk/el-loading.css'
import '../style.scss'

function formilyWrapperFactory(fieldProps = {}, selectTableProps = {}) {
  return defineComponent({
    props: {
      form: {
        type: Object,
        default: () => createForm(),
      },
    },
    setup(props) {
      return () => (
        <FormProvider form={props.form}>
          <Field
            name="selectTable"
            title="selectTable"
            dataSource={[
              { key: '1', name: 'title-1', description: 'description-1' },
              { key: '2', name: 'title-2', description: 'description-2' },
              { key: '3', name: 'title-3', description: 'description-3' },
            ]}
            {...fieldProps}
            component={[
              SelectTable,
              {
                columns: [
                  { prop: 'name', label: 'Title' },
                  { prop: 'description', label: 'Description' },
                ],
                ...selectTableProps,
              },
            ]}
          />
        </FormProvider>
      )
    },
  })
}

function formilyWrapperWithSlotFactory(fieldProps = {}, selectTableProps = {}) {
  return defineComponent({
    props: {
      form: {
        type: Object,
        default: () => createForm(),
      },
    },
    setup(props) {
      return () => (
        <FormProvider form={props.form}>
          <Field
            name="selectTable"
            title="selectTable"
            dataSource={[
              { key: '1', name: 'title-1', description: 'description-1' },
              { key: '2', name: 'title-2', description: 'description-2' },
              { key: '3', name: 'title-3', description: 'description-3' },
            ]}
            {...fieldProps}
            component={[SelectTable, { ...selectTableProps }]}
          >
            <ElTableColumn prop="name" label="Title" />
            <ElTableColumn
              prop="description"
              label="Description"
              v-slots={{
                default: ({ row }) => (
                  <div>{`${row.description}-${row.name}`}</div>
                ),
              }}
            />
          </Field>
        </FormProvider>
      )
    },
  })
}

function formilyWrapperWithSlotBySchemaFactory(
  fieldProps = {},
  selectTableProps = {},
) {
  return defineComponent({
    setup() {
      const form = createForm()
      const { SchemaArrayField } = createSchemaField({
        components: {
          SelectTable,
        },
      })
      return () => (
        <FormProvider form={form}>
          <SchemaArrayField
            name="selectTable"
            title="selectTable"
            dataSource={[
              { key: '1', name: 'title-1', description: 'description-1' },
              { key: '2', name: 'title-2', description: 'description-2' },
              { key: '3', name: 'title-3', description: 'description-3' },
            ]}
            x-component="SelectTable"
            x-component-props={{
              ...selectTableProps,
            }}
            x-content={(
              <Fragment>
                <ElTableColumn prop="name" label="Title" />
                <ElTableColumn prop="description" label="Description">
                  {{
                    default: ({ row }) => {
                      return <div>{`${row.description}-${row.name}`}</div>
                    },
                  }}
                </ElTableColumn>
              </Fragment>
            )}
          />
          <Field
            name="selectTable"
            title="selectTable"
            dataSource={[
              { key: '1', name: 'title-1', description: 'description-1' },
              { key: '2', name: 'title-2', description: 'description-2' },
              { key: '3', name: 'title-3', description: 'description-3' },
            ]}
            {...fieldProps}
            component={[SelectTable, { ...selectTableProps }]}
          >
            <ElTableColumn prop="name" label="Title" />
            <ElTableColumn prop="description" label="Description">
              {{
                default: ({ row }) => {
                  return <div>{`${row.description}-${row.name}`}</div>
                },
              }}
            </ElTableColumn>
          </Field>
        </FormProvider>
      )
    },
  })
}

describe('基础数据展示', async () => {
  it('应该显示为空数据', async () => {
    const screen = render(SelectTable)
    await expect.element(screen.getByText('No Data')).toBeInTheDocument()
    await expect.element(screen.getByText('已选择')).not.toBeInTheDocument()
  })

  it('应该显示数据', async () => {
    const screen = render(formilyWrapperFactory())
    await expect.element(screen.getByText('title-1')).toBeInTheDocument()
    await expect.element(screen.getByText('description-1')).toBeInTheDocument()
    await expect.element(screen.getByText('title-2')).toBeInTheDocument()
    await expect.element(screen.getByText('description-2')).toBeInTheDocument()
  })

  it('应该支持反显表单数据', async () => {
    const form = createForm({
      initialValues: {
        selectTable: ['1'],
      },
    })
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: {
        form,
      },
    })

    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
  })

  it('应该支持异步表单数据的反显', async () => {
    const form = createForm({
      initialValues: {
        selectTable: ['1'],
      },
    })
    const screen = render(() => (
      <FormProvider form={form}>
        <Field
          name="selectTable"
          title="selectTable"
          component={[
            SelectTable,
            {
              rowKey: 'key',
              columns: [
                { prop: 'name', label: 'Title' },
                { prop: 'description', label: 'Description' },
              ],
            },
          ]}
        />
      </FormProvider>
    ))
    await expect.element(screen.getByText('No Data')).toBeInTheDocument()
    const field = form.query('selectTable').take() as ArrayField
    field.loading = true
    const httpRequest = new Promise<FieldDataSource>((resolve) => {
      setTimeout(() => {
        resolve([
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ])
      }, 500)
    })

    const res = await httpRequest
    field.dataSource = res
    field.loading = false

    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
  })

  it('应该包含多选框', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: {
        form,
      },
    })
    await expect
      .element(
        screen
          .getByRole('row', { name: 'title-1 description-' })
          .getByRole('checkbox'),
      )
      .toBeInTheDocument()
  })

  it('带有插槽的内容应该正常展示', async () => {
    const screen = render(formilyWrapperWithSlotFactory({ rowKey: 'key' }))
    await expect
      .element(screen.getByText('description-1-title-1'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('description-2-title-2'))
      .toBeInTheDocument()
  })

  it('schema模式下应该正常展示', async () => {
    const screen = render(
      formilyWrapperWithSlotBySchemaFactory({ rowKey: 'key' }),
    )
    await expect
      .element(screen.getByText('description-1-title-1'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('description-2-title-2'))
      .toBeInTheDocument()
  })

  it('在dataSource改变时显示的内容也应该改变', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({ rowKey: 'key', dataSource: [] }),
      {
        props: {
          form,
        },
      },
    )
    await expect
      .poll(() => screen.getByRole('table').getByRole('checkbox').elements())
      .toHaveLength(1)
    const field = form
      .query('selectTable')
      .take<ArrayField>((field: ArrayField) => field)
    field.setDataSource([
      { key: '4', name: 'title-4', description: 'description-4' },
    ])
    await expect
      .poll(() => screen.getByRole('table').getByRole('checkbox').elements())
      .toHaveLength(2)
    await expect.element(screen.getByText('title-4')).toBeInTheDocument()
    await expect.element(screen.getByText('description-4')).toBeInTheDocument()
  })
})

describe('多选框交互', async () => {
  it('点击多选框后form表单中的值应该改变', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: {
        form,
      },
    })
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual([])
  })

  it('开启optionAsValue之后form表单中的值应该是整行数据', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({ rowKey: 'key', optionAsValue: true }),
      {
        props: {
          form,
        },
      },
    )
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual([
      {
        description: 'description-1',
        key: '1',
        name: 'title-1',
      },
    ])
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual([])
  })

  it('多选框选择两项后数组的长度应该为2，且再次点击应该取消选择', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: {
        form,
      },
    })
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
    await screen
      .getByRole('row', { name: 'title-2' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual(['1', '2'])
    await screen
      .getByRole('row', { name: 'title-2' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
  })

  it('在dataSource改变后再次显示时应该勾选已经选中的项', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        dataSource: [
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ],
      }),
      {
        props: {
          form,
        },
      },
    )
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
    const field = form
      .query('selectTable')
      .take<ArrayField>((field: ArrayField) => field)
    field.setDataSource([
      { key: '4', name: 'title-4', description: 'description-4' },
    ])
    await screen
      .getByRole('row', { name: 'title-4' })
      .getByRole('checkbox')
      .click()
    field.setDataSource([
      { key: '1', name: 'title-1', description: 'description-1' },
    ])
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
    field.setDataSource([
      { key: '1', name: 'title-1', description: 'description-1' },
      { key: '2', name: 'title-2', description: 'description-2' },
      { key: '4', name: 'title-4', description: 'description-4' },
    ])
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
    await expect
      .element(
        screen.getByRole('row', { name: 'title-4' }).getByRole('checkbox'),
      )
      .toBeChecked()
  })

  it('在组件有默认值时数值的应该正确勾选', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        initialValue: ['1'],
        dataSource: [
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ],
      }),
      {
        props: {
          form,
        },
      },
    )
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
  })

  it('点击行触发多选框选中事件', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({ rowKey: 'key', clickRowToSelect: true }),
      {
        props: { form },
      },
    )

    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual([])
  })

  it('关闭配置项后应该无法通过点击行触发多选框选中事件', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({ rowKey: 'key', clickRowToSelect: false }),
      {
        props: { form },
      },
    )
    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual(undefined)
    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual(undefined)
  })

  it('多选时，点击取消选择应该清空选中', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: { form },
    })
    // 点击第一行
    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
    // 点击取消选择
    await screen.getByText('取消选择').click()
    expect(form.query('selectTable').get('value')).toEqual([])
  })

  it('在optionAsValue为true时,组件有默认值时数值的应该正确勾选', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        initialValue: [{ key: '1' }, { key: '2' }],
        optionAsValue: true,
        dataSource: [
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ],
      }),
      {
        props: {
          form,
        },
      },
    )
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
  })

  it('多选时form表单中的值在改动后应该与选中的项保持一致', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: {
        form,
      },
    })
    form.setInitialValues({ selectTable: ['1'] })
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
    form.setValues({ selectTable: ['2'] })
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .not
      .toBeChecked()
    await expect
      .element(
        screen.getByRole('row', { name: 'title-2' }).getByRole('checkbox'),
      )
      .toBeChecked()
  })

  it('表单的值置空时原本选中的值也应该取消选择', async () => {
    const form = createForm({
      initialValues: { selectTable: ['1'] },
    })
    const screen = render(formilyWrapperFactory({ rowKey: 'key' }), {
      props: {
        form,
      },
    })

    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeChecked()
    form.setValues({ selectTable: [] })
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .not
      .toBeChecked()
    const field = form
      .query('selectTable')
      .take<ArrayField>((field: ArrayField) => field)
    field.setDataSource([
      { key: '1', name: 'title-1', description: 'description-1' },
    ])
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox'),
      )
      .not
      .toBeChecked()
  })
})

describe('单选框交互', async () => {
  it('点击多选框后form表单中的值应该改变', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        mode: 'single',
        highlightCurrentRow: true,
      }),
      {
        props: {
          form,
        },
      },
    )
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('radio')
      .click()
    expect(form.query('selectTable').get('value')).toEqual('1')
    await screen
      .getByRole('row', { name: 'title-2' })
      .getByRole('radio')
      .click()
    expect(form.query('selectTable').get('value')).toEqual('2')
  })

  it('在组件有默认值时数值的应该正确勾选', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        mode: 'single',
        initialValue: '1',
        dataSource: [
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ],
      }),
      {
        props: {
          form,
        },
      },
    )
    await expect
      .element(screen.getByRole('row', { name: 'title-1' }).getByRole('radio'))
      .toBeChecked()
  })

  it('在optionAsValue为true时,组件有默认值时数值的应该正确勾选', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        mode: 'single',
        initialValue: { key: '1' },
        optionAsValue: true,
        dataSource: [
          { key: '1', name: 'title-1', description: 'description-1' },
          { key: '2', name: 'title-2', description: 'description-2' },
          { key: '3', name: 'title-3', description: 'description-3' },
        ],
      }),
      {
        props: {
          form,
        },
      },
    )
    await expect
      .element(screen.getByRole('row', { name: 'title-1' }).getByRole('radio'))
      .toBeChecked()
  })

  it('点击行触发单选框选中事件', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'key',
        mode: 'single',
        clickRowToSelect: true,
      }),
      {
        props: { form },
      },
    )

    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual('1')

    await screen.getByRole('row', { name: 'title-2' }).click()
    expect(form.query('selectTable').get('value')).toEqual('2')
  })

  it('单选时，点击取消选择应该清空选中', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({ rowKey: 'key', mode: 'single' }),
      {
        props: { form },
      },
    )
    // 点击第一行
    await screen.getByRole('row', { name: 'title-1' }).click()
    expect(form.query('selectTable').get('value')).toEqual('1')
    // 点击取消选择
    await screen.getByText('取消选择').click()
    expect(form.query('selectTable').get('value')).toEqual(null)
  })

  it('单选时form表单中的值在改动后应该与选中的项保持一致', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({ rowKey: 'key', mode: 'single' }),
      {
        props: {
          form,
        },
      },
    )
    form.setInitialValues({ selectTable: '1' })
    await expect
      .element(screen.getByRole('row', { name: 'title-1' }).getByRole('radio'))
      .toBeChecked()
    form.setValues({ selectTable: '2' })
    await expect
      .element(screen.getByRole('row', { name: 'title-2' }).getByRole('radio'))
      .toBeChecked()
  })
})

describe.skip('树形选择', async () => {
  it('点击多选框后form表单中的值应该改变', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'id',
        dataSource: [
          {
            id: 1,
            date: '2016-05-02',
            name: 'title-1',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            id: 2,
            date: '2016-05-04',
            name: 'title-2',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            id: 3,
            date: '2016-05-01',
            name: 'title-3',
            address: 'No. 189, Grove St, Los Angeles',
            children: [
              {
                id: 31,
                date: '2016-05-01',
                name: 'title-3-1',
                address: 'No. 189, Grove St, Los Angeles',
              },
              {
                id: 32,
                date: '2016-05-01',
                name: 'title-3-2',
                address: 'No. 189, Grove St, Los Angeles',
              },
            ],
          },
          {
            id: 4,
            date: '2016-05-03',
            name: 'title-4',
            address: 'No. 189, Grove St, Los Angeles',
          },
        ],
        treeProps: {
          checkStrictly: false,
        },
      }),
      {
        props: {
          form,
        },
      },
    )
    await screen
      .getByRole('row', { name: 'title-1' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual([1])
    await screen
      .getByRole('row', { name: 'title-3' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual([1, 3, 31, 32])
  })

  it('开启checkStrictly后，点击多选框后form表单中的值不应该联动', async () => {
    const form = createForm()
    const screen = render(
      formilyWrapperFactory({
        rowKey: 'id',
        dataSource: [
          {
            id: 1,
            date: '2016-05-02',
            name: 'title-1',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            id: 2,
            date: '2016-05-04',
            name: 'title-2',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            id: 3,
            date: '2016-05-01',
            name: 'title-3',
            address: 'No. 189, Grove St, Los Angeles',
            children: [
              {
                id: 31,
                date: '2016-05-01',
                name: 'title-3-1',
                address: 'No. 189, Grove St, Los Angeles',
              },
              {
                id: 32,
                date: '2016-05-01',
                name: 'title-3-2',
                address: 'No. 189, Grove St, Los Angeles',
              },
            ],
          },
          {
            id: 4,
            date: '2016-05-03',
            name: 'title-4',
            address: 'No. 189, Grove St, Los Angeles',
          },
        ],
        treeProps: {
          checkStrictly: true,
        },
      }),
      {
        props: {
          form,
        },
      },
    )
    await screen
      .getByRole('row', { name: 'title-3' })
      .getByRole('checkbox')
      .click()
    expect(form.query('selectTable').get('value')).toEqual([3])
  })
})
