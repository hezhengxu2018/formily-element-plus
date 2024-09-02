<script lang="ts" setup>
import { useData } from 'vitepress'
import { useLang } from '../composables/lang'
import { getSidebarConfig, useSidebar } from '../composables/sidebar'

import VPSidebarLink from './sidebar/vp-sidebar-link.vue'

defineProps<{ open: boolean }>()
defineEmits(['close'])

// const isHome = useIsHome()
const { page, theme } = useData()
const { hasSidebar } = useSidebar()
const lang = useLang()

const sidebar = getSidebarConfig(
  theme.value.sidebar,
  page.value.relativePath,
  lang.value,
)
</script>

<template>
  <el-scrollbar v-if="hasSidebar" class="sidebar" :class="{ open }">
    <aside>
      <slot name="top" />
      <div class="sidebar-groups">
        <section v-for="(item, key) of sidebar" :key="key" class="sidebar-group">
          <p class="sidebar-group__title">
            {{ item.text }}
          </p>
          <VPSidebarLink
            v-for="(child, childKey) in item.children"
            :key="childKey" :item="child"
            @close="$emit('close')"
          />
        </section>
      </div>
      <slot name="bottom" />
    </aside>
  </el-scrollbar>
</template>
