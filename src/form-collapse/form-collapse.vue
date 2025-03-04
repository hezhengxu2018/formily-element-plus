<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IFormCollapse } from './utils'
import { observable } from '@formily/reactive'
import { isFn } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElBadge, ElCollapse, ElCollapseItem } from 'element-plus'
import { computed, useAttrs } from 'vue'
import { stylePrefix } from '../__builtins__'
import { createFormCollapse, usePanels } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  formCollapse: { type: Object as PropType<IFormCollapse> },
  activeKey: {
    type: [String, Number],
  },
})
const attrs = useAttrs()
const prefixCls = `${stylePrefix}-form-collapse`

const field = useField()
const schema = useFieldSchema()
const panels = observable.computed(() => usePanels(field.value, schema.value))
const formCollapseRef = computed(
  () => props.formCollapse ?? createFormCollapse(),
)

function takeActiveKeys(panelList) {
  if (props.activeKey)
    return props.activeKey
  if (formCollapseRef.value?.activeKeys)
    return formCollapseRef.value?.activeKeys
  if (attrs.accordion)
    return panels[0]?.name
  return panelList.map(item => item.name)
}

const panelErrorCounts = observable.computed(() => {
  return panels.value.map((item) => {
    const panelErrors = field.value.form.queryFeedbacks({
      type: 'error',
      address: `${field.value.address.concat(item.name)}.*`,
    })
    return panelErrors.length
  })
})
</script>

<template>
  <ElCollapse
    :class="prefixCls"
    :model-value="takeActiveKeys(panels.value)"
    v-bind="$attrs"
    @change="(key) => {
      formCollapseRef.setActiveKeys(key)
    }"
  >
    <template v-for="({ props: itemProps, schema: itemSchema, name }, index) of panels.value" :key="name">
      <ElCollapseItem v-bind="itemProps" :name="name">
        <template #default>
          <RecursionField :schema="itemSchema" :name="name" />
        </template>
        <template #title>
          <template v-if="itemSchema['x-content']?.title">
            <template v-if="isFn(itemSchema['x-content']?.title)">
              <template v-if="panelErrorCounts.value[index] !== 0">
                <ElBadge :class="`${prefixCls}-errors-badge`" :value="panelErrorCounts.value[index]">
                  <component :is="() => itemSchema['x-content']?.title(panelErrorCounts.value[index])" />
                </ElBadge>
              </template>
              <template v-else>
                <component :is="() => itemSchema['x-content']?.title(panelErrorCounts.value[index])" />
              </template>
            </template>
            <template v-else>
              <template v-if="panelErrorCounts.value[index] !== 0">
                <ElBadge :class="`${prefixCls}-errors-badge`" :value="panelErrorCounts.value[index]">
                  <component :is="() => itemSchema['x-content']?.title" />
                </ElBadge>
              </template>
              <template v-else>
                <component :is="() => itemSchema['x-content']?.title" />
              </template>
            </template>
          </template>
          <template v-else-if="panelErrorCounts.value[index] !== 0">
            <ElBadge :class="`${prefixCls}-errors-badge`" :value="panelErrorCounts.value[index]">
              <span>
                {{ itemSchema['x-component-props']?.title }}
              </span>
            </ElBadge>
          </template>
          <template v-else>
            {{ itemSchema['x-component-props']?.title }}
          </template>
        </template>
      </ElCollapseItem>
    </template>
  </ElCollapse>
</template>
