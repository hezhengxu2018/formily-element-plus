<script setup lang="tsx">
import { Field } from '@formily/vue'
import { FormDialog, FormItem, FormLayout, Input } from '@sliver/formily-element-plus'
import { ElButton } from 'element-plus'

function handleOpen() {
  FormDialog('弹框表单', {
    header: ({ form, reject }) => (
      <div>
        <ElButton onClick={() => reject()}>关闭</ElButton>
        <span>这是标题</span>
      </div>

    ),
    default: () => (
      <FormLayout labelCol={6} wrapperCol={10}>
        <Field
          name="aaa"
          required
          title="输入框1"
          decorator={[FormItem]}
          component={[Input]}
        />
        <Field
          name="bbb"
          required
          title="输入框2"
          decorator={[FormItem]}
          component={[Input]}
        />
        <Field
          name="ccc"
          required
          title="输入框3"
          decorator={[FormItem]}
          component={[Input]}
        />
        <Field
          name="ddd"
          required
          title="输入框4"
          decorator={[FormItem]}
          component={[Input]}
        />
      </FormLayout>
    ),
    footer: ({ doms, form, resolve }) => {
      return () => {
        const defaultButtons = doms()
        return [
          defaultButtons[0],
          <ElButton loading={form.submitting} onClick={() => resolve('extra')}>保存草稿</ElButton>,
          <ElButton loading={form.submitting} onClick={() => resolve('extra1')}>额外按钮1</ElButton>,
          <ElButton loading={form.submitting} onClick={() => resolve('extra2')}>额外按钮2</ElButton>,
          <ElButton loading={form.submitting} onClick={() => resolve('extra3')}>额外按钮3</ElButton>,
          defaultButtons[1],
        ]
      }
    },
  })
    .forOpen((payload, next) => {
      next({
        initialValues: {
          aaa: '123',
        },
      })
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        next(payload)
      }, 1000)
    })
    .forExtra((payload, next) => {
      setTimeout(() => {
        console.log('extra')
        next(payload)
      }, 1000)
    })
    .forExtra1((payload, next) => {
      setTimeout(() => {
        console.log('extra1')
        next(payload)
      }, 1000)
    })
    .forExtra2((payload, next) => {
      setTimeout(() => {
        console.log('extra2')
        next(payload)
      }, 1000)
    })
    .forExtra3((payload, next) => {
      setTimeout(() => {
        console.log('extra3')
        next(payload)
      }, 1000)
    })
    .forCancel((payload, next) => {
      setTimeout(() => {        
        next(payload)
      }, 1000)
    })
    .open()
    .then(console.log)
    .catch(console.error)
}
</script>

<template>
  <ElButton @click="handleOpen">
    点击打开表单
  </ElButton>
</template>
