<script setup lang="tsx">
import { createSchemaField } from '@formily/vue'
import { FormDrawer, FormItem, FormLayout, Input } from '@sliver/formily-element-plus'
import { ElButton } from 'element-plus'

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})

// 抽屉表单组件
const DrawerForm = {
  props: ['form'],
  data() {
    const schema = {
      type: 'object',
      properties: {
        aaa: {
          'type': 'string',
          'title': '输入框1',
          'required': true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        bbb: {
          'type': 'string',
          'title': '输入框2',
          'required': true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        ccc: {
          'type': 'string',
          'title': '输入框3',
          'required': true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        ddd: {
          'type': 'string',
          'title': '输入框4',
          'required': true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    }
    return {
      schema,
    }
  },
  render() {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <SchemaField schema={this.schema} />
      </FormLayout>
    )
  },
}

function handleOpen() {
  FormDrawer('抽屉表单', DrawerForm)
    .forOpen((props, next) => {
      setTimeout(() => {
        next()
      }, 1000)
    })
    .open({
      initialValues: {
        aaa: '123',
      },
    })
    .then(console.log)
}
</script>

<template>
  <ElButton @click="handleOpen">
    点击打开表单
  </ElButton>
</template>
