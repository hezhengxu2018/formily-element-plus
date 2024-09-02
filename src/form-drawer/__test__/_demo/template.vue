<script setup lang="tsx">
import { ElButton } from 'element-plus'
import { Field } from '@formily/vue'
import {
  DatePicker,
  FormDrawer,
  FormItem,
  FormLayout,
  Input,
} from '@sliver/formily-element-plus'

async function handleOpen() {
  await FormDrawer({ title: '抽屉表单', size: '80%' }, () => (
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
        title="日期选择框"
        decorator={[FormItem]}
        component={[DatePicker]}
      />
      <FormDrawer.Footer>
        <span style={{ marginLeft: '4px' }}>扩展文案</span>
      </FormDrawer.Footer>
    </FormLayout>
  ))
    .forOpen((payload, next) => {
      console.log(payload)
      next()
    })
    .open({
      initialValues: {
        aaa: '123',
      },
    })
}
</script>

<template>
  <ElButton @click="handleOpen">
    点击打开表单
  </ElButton>
</template>
