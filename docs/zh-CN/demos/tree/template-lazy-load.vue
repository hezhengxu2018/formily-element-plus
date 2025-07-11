<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, FormLayout, Tree } from '@sliver/formily-element-plus'

const form = createForm()

async function loadNode(node, resolve) {
  if (node.level === 0) {
    return resolve([
      {
        id: 1,
        label: 'Level one 1 ---- ID：1',
        isLeaf: false,
      },
      {
        id: 2,
        label: 'Level one 2 ---- ID：2',
        isLeaf: false,
      },
      {
        id: 3,
        label: 'Level one 3 ---- ID：3',
        isLeaf: false,
      },
    ])
  }

  await new Promise<void>((res) => {
    setTimeout(() => {
      res()
    }, 500)
  })
  if (node.data.id === 1) {
    return resolve([
      {
        id: 4,
        label: 'Level two 1-1 ---- ID：4',
        isLeaf: false,
      },
    ])
  }
  if (node.data.id === 2) {
    return resolve([
      {
        id: 5,
        label: 'Level two 2-1 ---- ID：5',
        isLeaf: true,
      },
      {
        id: 6,
        label: 'Level two 2-2 ---- ID：6',
        isLeaf: true,
      },
    ])
  }
  if (node.data.id === 3) {
    return resolve([
      {
        id: 7,
        label: 'Level two 3-1 ---- ID：7',
        isLeaf: true,
      },
      {
        id: 8,
        label: 'Level two 3-2 ---- ID：8',
        isLeaf: true,
      },
    ])
  }
  if (node.data.id === 4) {
    return resolve([
      {
        id: 9,
        label: 'Level three 1-1-1 ---- ID：9',
        isLeaf: true,
      },
      {
        id: 10,
        label: 'Level three 1-1-2 ---- ID：10',
        isLeaf: true,
      },
    ])
  }

  return resolve([])
}
</script>

<template>
  <FormProvider :form="form">
    <FormLayout :label-col="4" :wrapper-col="16">
      <Field
        name="tree1"
        title="Tree1"
        :decorator="[FormItem]"
        :component="[Tree, {
          nodeKey: 'id',
          valueType: 'all',
          lazy: true,
          load: loadNode,
        }]"
      />
    </FormLayout>
  </FormProvider>
</template>
