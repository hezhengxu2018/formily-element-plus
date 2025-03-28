<script setup lang="ts">
import type { Field } from '@formily/core'
import type { CascaderInstance } from 'element-plus'
import { useField } from '@formily/vue'
import { ElSpace, ElTag, ElText } from 'element-plus'
import { useAttrs } from 'vue'
import { stylePrefix } from '../__builtins__/configs'
import { usePlaceholder } from './index'

defineOptions({
  name: 'FPreviewTextCascader',
  inheritAttrs: false,
})

const props = defineProps<{
  value: any
}>()
const prefixCls = `${stylePrefix}-preview-text`
const fieldRef = useField<Field>()
const field = fieldRef.value
const attrs = useAttrs() as CascaderInstance['$props']
const isMultiple = !!attrs.props?.multiple
const isShowAllLevels = attrs.showAllLevels ?? true
const dataSource: any[] = field?.dataSource ?? []
const placeholder = usePlaceholder(props.value)

const valueKey = attrs.props?.value || 'value'
const labelKey = attrs.props?.label || 'label'

function findLabel(value: any, dataSource: any[]): any {
  const foundItem = dataSource.find(item => item?.[valueKey] === value)
  if (foundItem)
    return foundItem[labelKey]
  return dataSource
    .map(item => item?.children ? findLabel(value, item.children) : undefined)
    .find(label => label !== undefined)
}
</script>

<template>
  <div :class="prefixCls">
    <template v-if="isMultiple">
      <template v-if="Array.isArray(props.value) && Array.isArray($props.value[0])">
        <ElSpace>
          <ElTag v-for="(value, key) of props.value" :key="key">
            <template v-if="isShowAllLevels">
              {{ value.map(item => findLabel(item, dataSource) || placeholder.value).join(` ${attrs.separator ?? '/'} `) }}
            </template>
            <template v-else>
              {{ findLabel(value[value.length - 1], dataSource) || placeholder.value }}
            </template>
          </ElTag>
        </ElSpace>
      </template>
      <template v-else>
        <ElText>
          {{ placeholder }}
        </ElText>
      </template>
    </template>
    <template v-else>
      <template v-if="Array.isArray(props.value)">
        <ElText>
          <template v-if="isShowAllLevels">
            {{ props.value.map(item => findLabel(item, dataSource) || placeholder).join(` ${attrs.separator ?? '/'} `) }}
          </template>
          <template v-else>
            {{ findLabel(props.value[props.value.length - 1], dataSource) || placeholder }}
          </template>
        </ElText>
      </template>
      <template v-else>
        <ElText>
          {{ placeholder }}
        </ElText>
      </template>
    </template>
  </div>
</template>
