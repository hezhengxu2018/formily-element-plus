<script setup lang="ts">
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import { ElRadio, ElTree } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'

export interface TreeValueTypeProps {
  data: TreeNodeData[]
  mode?: 'single' | 'multiple'
  valueType?: 'all' | 'parent' | 'child' | 'path'
  nodeKey?: string
  checkStrictly?: boolean
  modelValue?: any
  treeProps?: {
    children?: string
    label?: string
    disabled?: string
  }
}

const props = withDefaults(defineProps<TreeValueTypeProps>(), {
  valueType: 'all',
  nodeKey: 'id',
  checkStrictly: true,
  treeProps: () => ({
    children: 'children',
    label: 'label',
    disabled: 'disabled',
  }),
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any, nodes: TreeNodeData | TreeNodeData[]]
}>()

const treeRef = ref<InstanceType<typeof ElTree>>()
const checkedKeys = ref<any[]>([])

// 扁平化树数据
function flattenTree(nodes: TreeNodeData[], result: TreeNodeData[] = []): TreeNodeData[] {
  for (const node of nodes) {
    result.push(node)
    if (node[props.treeProps.children!] && node[props.treeProps.children!].length > 0) {
      flattenTree(node[props.treeProps.children!], result)
    }
  }
  return result
}

const flatData = computed(() => flattenTree(props.data))

// 获取节点的所有子节点keys
function getChildrenKeys(node: TreeNodeData): any[] {
  const children = node[props.treeProps.children!] || []
  if (children.length === 0)
    return []

  const keys: any[] = []
  const traverse = (nodes: TreeNodeData[]) => {
    for (const child of nodes) {
      if (!child[props.treeProps.disabled!]) {
        keys.push(child[props.nodeKey])
        const grandChildren = child[props.treeProps.children!] || []
        if (grandChildren.length > 0) {
          traverse(grandChildren)
        }
      }
    }
  }

  traverse(children)
  return keys
}

// 获取选中路径
function getSelectedPath(nodes: TreeNodeData[], selectedKeys: any[]): TreeNodeData[] {
  const result: TreeNodeData[] = []

  for (const node of nodes) {
    const children = node[props.treeProps.children!] || []
    const hasSelectedChild = children.length > 0
      ? getSelectedPath(children, selectedKeys).length > 0
      : false

    if (selectedKeys.includes(node[props.nodeKey]) || hasSelectedChild) {
      const newNode = { ...node }
      if (hasSelectedChild && children.length > 0) {
        newNode[props.treeProps.children!] = getSelectedPath(children, selectedKeys)
      }
      result.push(newNode)
    }
  }

  return result
}

// 根据valueType处理输出数据
function getOutputData(keys: any[]) {
  const selectedNodes = flatData.value.filter(node =>
    keys.includes(node[props.nodeKey]),
  )

  let outputKeys = [...keys]
  let outputNodes = [...selectedNodes]

  switch (props.valueType) {
    case 'parent': {
      // 只返回父节点，移除子节点
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
      // 只返回子节点，移除有子节点被选中的父节点
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
      // 返回完整路径结构
      return {
        value: getSelectedPath(props.data, keys),
        nodes: selectedNodes,
      }
    }

    default: { // 'all'
      // 返回所有选中的节点
      break
    }
  }

  if (props.mode === 'single') {
    return {
      value: outputKeys[0],
      nodes: outputNodes[0],
    }
  }

  return {
    value: outputKeys,
    nodes: outputNodes,
  }
}

// 处理多选变化
function handleCheck(data: TreeNodeData, checkState: any) {
  const keys = checkState.checkedKeys
  checkedKeys.value = keys

  const { value, nodes } = getOutputData(keys)
  emit('update:modelValue', value)
  emit('change', value, nodes)
}

// 处理单选变化
function handleRadioChange(node: TreeNodeData) {
  checkedKeys.value = [node[props.nodeKey]]

  const { value, nodes } = getOutputData(checkedKeys.value)
  emit('update:modelValue', value)
  emit('change', value, nodes)
}

// 处理节点点击（单选模式）
function handleNodeClick(data: TreeNodeData) {
  if (props.mode === 'single' && !data[props.treeProps.disabled!]) {
    handleRadioChange(data)
  }
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    if (props.mode === 'single') {
      checkedKeys.value = newValue ? [newValue] : []
    }
    else {
      checkedKeys.value = Array.isArray(newValue) ? newValue : []
    }

    // 更新树的选中状态
    nextTick(() => {
      if (treeRef.value && props.mode === 'multiple') {
        treeRef.value.setCheckedKeys(checkedKeys.value)
      }
    })
  }
}, { immediate: true })

// 暴露方法
defineExpose({
  setCheckedKeys: (keys: any[]) => {
    checkedKeys.value = keys
    treeRef.value?.setCheckedKeys(keys)
  },
  getCheckedKeys: () => checkedKeys.value,
  filter: (value: string) => {
    treeRef.value?.filter(value)
  },
})
</script>

<template>
  <ElTree
    ref="treeRef"
    :data="data"
    :props="treeProps"
    :node-key="nodeKey"
    :default-checked-keys="checkedKeys"
    @check="handleCheck"
    @node-click="handleNodeClick"
  >
    <template #default="{ node, data }">
      <span class="tree-node">
        <ElRadio
          v-if="mode === 'single'"
          :model-value="checkedKeys.includes(data[nodeKey])"
          :disabled="data.disabled"
          @change="handleRadioChange(data)"
        />
        <span class="node-label">{{ node.label }}</span>
      </span>
    </template>
  </ElTree>
</template>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-label {
  flex: 1;
}
</style>
