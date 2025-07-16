<script setup lang="ts">
import type { Field } from '@formily/core'
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import type { TreeValueTypeProps } from './types'
import { isArr, isFn } from '@formily/shared'
import { useField } from '@formily/vue'
import { ElScrollbar, ElTree, vLoading } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'
import { useCleanAttrs } from '../__builtins__'

defineOptions({
  name: 'Tree',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeValueTypeProps>(), {
  valueType: 'all',
  optionAsValue: false,
  includeHalfChecked: false,
  props: {
    children: 'children',
    label: 'label',
    disabled: 'disabled',
  },
})

const emit = defineEmits<{
  change: [value: any]
}>()

const { props: attrs } = useCleanAttrs()
const treeRef = ref<InstanceType<typeof ElTree>>()
const checkedKeys = ref<any[]>([])

function flattenTree(nodes: TreeNodeData[], result: TreeNodeData[] = []): TreeNodeData[] {
  for (const node of nodes) {
    result.push(node)
    if (node[props.props.children!] && node[props.props.children!].length > 0) {
      flattenTree(node[props.props.children!], result)
    }
  }
  return result
}

// 添加处理禁用状态的函数
function addDisabledToNodes(nodes: TreeNodeData[]): TreeNodeData[] {
  if (!attrs.value.disabled) {
    return nodes
  }

  return nodes.map((node) => {
    const newNode = { ...node }
    newNode[props.props.disabled!] = true

    if (node[props.props.children!] && node[props.props.children!].length > 0) {
      newNode[props.props.children!] = addDisabledToNodes(node[props.props.children!])
    }

    return newNode
  })
}
// 添加处理后的数据计算属性
const processedData = computed(() => {
  return addDisabledToNodes(props.data ?? [])
})

// 修改 flatData 计算属性
const flatData = computed(() => flattenTree(processedData.value ?? []))

function traverseTree(
  nodes: TreeNodeData[],
  callback: (node: TreeNodeData) => void,
  options: {
    leafOnly?: boolean
  } = {},
) {
  const { leafOnly = false } = options

  for (const node of nodes) {
    const children = node[props.props.children!] || []
    const isLeaf = children.length === 0

    if (!leafOnly || isLeaf) {
      callback(node)
    }
    if (children.length > 0) {
      traverseTree(children, callback, options)
    }
  }
}

function getChildrenKeys(node: TreeNodeData): any[] {
  const children = node[props.props.children!] || []
  if (children.length === 0)
    return []

  const keys: any[] = []
  traverseTree(children, (child) => {
    keys.push(child[props.nodeKey])
  })

  return keys
}

function extractKeysFromPath(pathNodes: TreeNodeData[]): any[] {
  const keys: any[] = []
  traverseTree(pathNodes, (node) => {
    keys.push(node[props.nodeKey])
  }, { leafOnly: true })

  return keys
}

// 获取选中路径
function getSelectedPath(nodes: TreeNodeData[], selectedKeys: any[]): TreeNodeData[] {
  const result: TreeNodeData[] = []

  for (const node of nodes) {
    const children = node[props.props.children!] || []
    const hasSelectedChild = children.length > 0
      ? getSelectedPath(children, selectedKeys).length > 0
      : false

    if (selectedKeys.includes(node[props.nodeKey]) || hasSelectedChild) {
      const newNode = { ...node }
      if (hasSelectedChild && children.length > 0) {
        newNode[props.props.children!] = getSelectedPath(children, selectedKeys)
      }
      result.push(newNode)
    }
  }

  return result
}

function getOutputData(keys: any[], halfCheckedKeys: any[] = []) {
  const selectedNodes = flatData.value.filter(node =>
    keys.includes(node[props.nodeKey]),
  )

  let outputKeys = [...keys]
  let outputNodes = [...selectedNodes]

  if (attrs.value.checkStrictly) {
    return {
      value: outputKeys,
      nodes: outputNodes,
    }
  }

  switch (props.valueType) {
    case 'parent': {
      const allChildKeys: any[] = []
      for (const node of selectedNodes) {
        allChildKeys.push(...getChildrenKeys(node))
      }
      outputKeys = keys.filter(key => !allChildKeys.includes(key))
      outputNodes = selectedNodes.filter(node =>
        outputKeys.includes(node[props.nodeKey]),
      )
      break
    }

    case 'child': {
      for (const node of selectedNodes) {
        const childKeys = getChildrenKeys(node)
        const hasSelectedChild = childKeys.some(key => keys.includes(key))
        if (hasSelectedChild) {
          outputKeys = outputKeys.filter(key => key !== node[props.nodeKey])
          outputNodes = outputNodes.filter(n =>
            n[props.nodeKey] !== node[props.nodeKey],
          )
        }
      }
      break
    }

    case 'path': {
      const selectedPath = getSelectedPath(props.data, keys)
      return {
        value: selectedPath,
        nodes: selectedPath,
      }
    }

    default: { // 'all'
      if (props.includeHalfChecked && halfCheckedKeys.length > 0) {
        const halfCheckedNodes = flatData.value.filter(node =>
          halfCheckedKeys.includes(node[props.nodeKey]),
        )
        outputKeys = [...outputKeys, ...halfCheckedKeys]
        outputNodes = [...outputNodes, ...halfCheckedNodes]
      }
      break
    }
  }

  return {
    value: outputKeys,
    nodes: outputNodes,
  }
}

async function handleCheck() {
  await nextTick()
  const keys = treeRef.value.getCheckedKeys()
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys() || []
  checkedKeys.value = keys

  const { value, nodes } = getOutputData(keys, halfCheckedKeys)
  if (props.optionAsValue) {
    isFn(props.optionFormatter)
      ? emit('change', nodes.map((element, index, array) => {
          return props.optionFormatter(element, index, array)
        }))
      : emit('change', nodes)
  }
  else {
    emit('change', value)
  }
}

function findParents(nodes: TreeNodeData[], targetKey: any, parents: any[] = []): any[] {
  for (const node of nodes) {
    const currentPath = [...parents, node[props.nodeKey]]

    if (node[props.nodeKey] === targetKey) {
      return currentPath
    }

    const children = node[props.props.children!] || []
    if (children.length > 0) {
      const found = findParents(children, targetKey, currentPath)
      if (found.length > 0) {
        return found
      }
    }
  }
  /* istanbul ignore next -- @preserve */
  return []
}
// 根据valueType将输入值转换为checkedKeys
function getInputKeys(inputValue: any): any[] {
  /* istanbul ignore if -- @preserve */
  if (!inputValue || !isArr(inputValue))
    return []

  const valueArray = props.optionAsValue ? inputValue.map((item: any) => item[props.nodeKey]) : inputValue
  const filterLeafNodes = (keys: any[]): any[] => {
    return keys.filter((key) => {
      const node = flatData.value.find(n => n[props.nodeKey] === key)
      if (!node)
        return false
      const children = node[props.props.children!] || []
      return children.length === 0
    })
  }

  if (attrs.value.checkStrictly) {
    return valueArray
  }

  switch (props.valueType) {
    case 'parent': {
      const allKeys = [...valueArray]

      for (const key of valueArray) {
        const node = flatData.value.find(n => n[props.nodeKey] === key)
        if (node) {
          const childKeys = getChildrenKeys(node)
          allKeys.push(...childKeys)
        }
      }
      return filterLeafNodes(allKeys)
    }

    case 'child': {
      const allKeys = [...valueArray]
      for (const key of valueArray) {
        const parentPath = findParents(props.data, key)
        allKeys.push(...parentPath)
      }
      return filterLeafNodes(allKeys)
    }

    case 'path': {
      return extractKeysFromPath(valueArray)
    }

    default: { // 'all'
      return filterLeafNodes(valueArray)
    }
  }
}

watch(() => props.value, (newValue) => {
  if (newValue !== undefined) {
    checkedKeys.value = getInputKeys(newValue)
    nextTick(() => {
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(checkedKeys.value)
      }
    })
  }
}, { immediate: true })

watch(() => [props.valueType, props.optionAsValue, props.includeHalfChecked], () => {
  handleCheck()
}, { immediate: false })

const fieldRef = useField<Field>()
/* istanbul ignore next 3 -- @preserve */
fieldRef.value?.inject({
  getTreeRef: () => {
    return treeRef
  },
})
</script>

<template>
  <ElScrollbar :height="props.height" :max-height="props.maxHeight">
    <ElTree
      ref="treeRef"
      v-loading="attrs.loading"
      :data="processedData"
      :props="props.props"
      :node-key="props.nodeKey"
      :default-checked-keys="checkedKeys"
      :show-checkbox="true"
      v-bind="attrs"
      @check="handleCheck"
    />
  </ElScrollbar>
</template>
