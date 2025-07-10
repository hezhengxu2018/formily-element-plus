<script lang="ts" setup>
import { createForm } from '@formily/core'
import { autorun, toJS } from '@formily/reactive'
import { isPlainObj } from '@formily/shared'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, FormLayout, Select, Switch, Tree } from '@sliver/formily-element-plus'
import { codeToHtml } from 'shiki'
import { ref } from 'vue'

const form = createForm()

const shikiTree = ref('')
autorun(async () => {
  if (!form.values.tree)
    return
  const treeValue = toJS(form.values.tree)
  const treeStrValue = isPlainObj(treeValue?.[0]) ? JSON.stringify(treeValue, null, 2) : JSON.stringify(treeValue)
  shikiTree.value = await codeToHtml(treeStrValue, {
    lang: 'javascript',
    themes: {
      light: 'min-light',
      dark: 'nord',
    },
  })
})

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
    <FormLayout :label-col="4" :wrapper-col="16">
      <Field
        name="valueType"
        title="Tree的值类型"
        :decorator="[FormItem]"
        :component="[Select]"
        initial-value="all"
        :data-source="
          [{
             label: '全部',
             value: 'all',
           },
           {
             label: '优先父节点',
             value: 'parent',
           },
           {
             label: '仅子节点',
             value: 'child',
           },
           {
             label: '路径',
             value: 'path',
           },
          ]"
        :reactions="field => {
          const tree = field.query('tree').take();
          if (tree) {
            tree.setComponentProps({ ...tree.componentProps, valueType: field.value })
          }
        }"
      />
      <Field
        name="optionAsValue"
        title="optionAsValue"
        :decorator="[FormItem]"
        :component="[Switch]"
        :initial-value="false"
        :reactions="field => {
          const tree = field.query('tree').take();
          if (tree) {
            tree.setComponentProps({ ...tree.componentProps, optionAsValue: field.value })
          }
        }"
      />
      <Field
        name="includeHalfChecked"
        title="包括半勾选节点"
        :decorator="[FormItem]"
        :component="[Switch]"
        :initial-value="false"
        :reactions="field => {
          const tree = field.query('tree').take();
          if (tree) {
            tree.setComponentProps({ ...tree.componentProps, includeHalfChecked: field.value })
          }
        }"
      />
      <Field
        name="tree"
        title="Tree"
        :decorator="[FormItem]"
        :component="[Tree, {
          showCheckbox: true,
          nodeKey: 'id',
          valueType: 'all',
          includeHalfChecked: true,
        }]"
        :data-source="data"
        :initial-value="[9]"
      />
    </FormLayout>
  </FormProvider>
  <div v-html="shikiTree" />
</template>
