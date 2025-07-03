<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, Submit, Tree } from '@sliver/formily-element-plus'

const form = createForm()

async function log(value) {
  console.log(value)
}

const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
</script>

<template>
  <FormProvider :form="form">
    <Field
      name="tree"
      title="树形选择"
      :decorator="[FormItem]"
      :component="[Tree, {
        showCheckbox: true,
        nodeKey: 'id',
        valueType: 'path',
      }]"
      :data-source="data"
    />
    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
