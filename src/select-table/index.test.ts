import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-table.css'
import type { ArrayField } from '@formily/core'
import { createForm } from '@formily/core'
import { defineComponent, h } from 'vue'
import { Field, FormProvider } from '@formily/vue'
import SelectTable from './index'
import './style'

function formilyWrapperFactory(fieldProps = {}, selectTableProps = {}) {
  return defineComponent({
    data() {
      return {
        form: createForm(),
      }
    },
    render() {
      return (
        h(FormProvider, {
          form: this.form,
        }, () => h(Field, {
          name: 'selectTable',
          title: 'selectTable',
          dataSource: [{ key: '1', name: 'title-1', description: 'description-1' }, { key: '2', name: 'title-2', description: 'description-2' }, { key: '3', name: 'title-3', description: 'description-3' }],
          ...fieldProps,
          component: [SelectTable, {
            columns: [
              { prop: 'name', label: 'Title' },
              { prop: 'description', label: 'Description' },
            ],
            ...selectTableProps,
          }],
        }))
      )
    },
  })
}

describe('基础数据展示', async () => {
  it('应该显示为空数据', async () => {
    const screen = render(SelectTable)
    await expect.element(screen.getByText('No Data')).toBeInTheDocument()
  })

  it('应该显示数据', async () => {
    const screen = render(formilyWrapperFactory())
    await expect.element(screen.getByText('title-1')).toBeInTheDocument()
    await expect.element(screen.getByText('description-1')).toBeInTheDocument()
    await expect.element(screen.getByText('title-2')).toBeInTheDocument()
    await expect.element(screen.getByText('description-2')).toBeInTheDocument()
  })

  it('应该包含多选框', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ primaryKey: 'key' }), {
      data() {
        return {
          form,
        }
      },
    })
    await expect.element(screen.getByRole('row', { name: 'title-1 description-' }).getByRole('checkbox')).toBeInTheDocument()
  })

  it.todo('当mode为single时应该显示单选框')

  it('在dataSource改变时显示的内容也应该改变', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ primaryKey: 'key', dataSource: [] }), {
      data() {
        return {
          form,
        }
      },
    })
    await expect.poll(() => screen.getByRole('table').getByRole('checkbox').elements()).toHaveLength(1)
    const field = form.query('selectTable').take<ArrayField>((field: ArrayField) => field)
    field.setDataSource([{ key: '4', name: 'title-4', description: 'description-4' }])
    await expect.poll(() => screen.getByRole('table').getByRole('checkbox').elements()).toHaveLength(2)
    await expect.element(screen.getByText('title-4')).toBeInTheDocument()
    await expect.element(screen.getByText('description-4')).toBeInTheDocument()
  })
})

describe('多选框交互', async () => {
  it('点击多选框后form表单中的值应该改变', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ primaryKey: 'key' }), {
      data() {
        return {
          form,
        }
      },
    })
    await screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
    await screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual([])
  })

  it('多选框选择两项后数组的长度应该为2，且再次点击应该取消选择', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ primaryKey: 'key' }), {
      data() {
        return {
          form,
        }
      },
    })
    await screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
    await screen.getByRole('row', { name: 'title-2' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual(['1', '2'])
    await screen.getByRole('row', { name: 'title-2' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual(['1'])
  })

  it('在dataSource改变后再次显示时应该勾选已经选中的项', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ primaryKey: 'key', dataSource: [{ key: '1', name: 'title-1', description: 'description-1' }, { key: '2', name: 'title-2', description: 'description-2' }, { key: '3', name: 'title-3', description: 'description-3' }] }), {
      data() {
        return {
          form,
        }
      },
    })
    await screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox').click()
    await expect.element(screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox')).toBeChecked()
    const field = form.query('selectTable').take<ArrayField>((field: ArrayField) => field)
    field.setDataSource([{ key: '4', name: 'title-4', description: 'description-4' }])
    await screen.getByRole('row', { name: 'title-4' }).getByRole('checkbox').click()
    field.setDataSource([{ key: '1', name: 'title-1', description: 'description-1' }])
    await expect.element(screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox')).toBeChecked()
    field.setDataSource([{ key: '1', name: 'title-1', description: 'description-1' }, { key: '2', name: 'title-2', description: 'description-2' }, { key: '4', name: 'title-4', description: 'description-4' }])
    await expect.element(screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox')).toBeChecked()
    await expect.element(screen.getByRole('row', { name: 'title-4' }).getByRole('checkbox')).toBeChecked()
  })
})

describe('单选框交互', async () => {
  it('点击多选框后form表单中的值应该改变', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({ primaryKey: 'key', mode: 'single', highlightCurrentRow: true }), {
      data() {
        return {
          form,
        }
      },
    })
    await screen.getByRole('row', { name: 'title-1' }).getByRole('radio').click()
    expect(form.query('selectTable').get('value')).toEqual('1')
    await screen.getByRole('row', { name: 'title-2' }).getByRole('radio').click()
    expect(form.query('selectTable').get('value')).toEqual('2')
  })
})

describe('树形选择', async () => {
  it('点击多选框后form表单中的值应该改变', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({
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
    }), {
      data() {
        return {
          form,
        }
      },
    })
    await screen.getByRole('row', { name: 'title-1' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual([1])
    await screen.getByRole('row', { name: 'title-3' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual([1, 3, 31, 32])
  })

  it('开启checkStrictly后，点击多选框后form表单中的值不应该联动', async () => {
    const form = createForm()
    const screen = render(formilyWrapperFactory({
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
    }), {
      data() {
        return {
          form,
        }
      },
    })
    await screen.getByRole('row', { name: 'title-3' }).getByRole('checkbox').click()
    expect(form.query('selectTable').get('value')).toEqual([3])
  })
})
