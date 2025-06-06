<script setup lang="ts">
// import { ElMessageBox } from 'element-plus'
// import nprogress from 'nprogress'
// import dayjs from 'dayjs'
import { isClient, useEventListener, useToggle } from '@vueuse/core'
import { onMounted, provide } from 'vue'
import { useSidebar } from '../composables/sidebar'
import { useToggleWidgets } from '../composables/toggle-widgets'
// import { useLang } from '../composables/lang'
import { breakpoints } from '../constant'
import VPContent from './vp-content.vue'
import VPNav from './vp-nav.vue'
import VPOverlay from './vp-overlay.vue'
import VPSidebar from './vp-sidebar.vue'
import VPSkipLink from './vp-skip-link.vue'
import VPSubNav from './vp-subnav.vue'

// const USER_PREFER_GITHUB_PAGE = 'USER_PREFER_GITHUB_PAGE'
const [isSidebarOpen, toggleSidebar] = useToggle(false)
const { hasSidebar } = useSidebar()
// const heroImageSlotExists = computed(() => !!slots['home-hero-image'])
provide('hero-image-slot-exists', true)

useToggleWidgets(isSidebarOpen, () => {
  if (!isClient)
    return
  if (window.outerWidth >= breakpoints.lg) {
    toggleSidebar(false)
  }
})

useEventListener('keydown', (e) => {
  if (!isClient)
    return
  if (e.key === 'Escape' && isSidebarOpen.value) {
    toggleSidebar(false)
    document.querySelector<HTMLButtonElement>('.sidebar-button')?.focus()
  }
})

onMounted(async () => {
  if (!isClient)
    return
  globalThis.addEventListener(
    'click',
    (e) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link)
        return

      const { protocol, hostname, pathname, target } = link
      const currentUrl = globalThis.location
      const extMatch = pathname.match(/\.\w+$/)
      // only intercept inbound links
      if (
        !e.ctrlKey
        && !e.shiftKey
        && !e.altKey
        && !e.metaKey
        && target !== `_blank`
        && protocol === currentUrl.protocol
        && hostname === currentUrl.hostname
        && !(extMatch && extMatch[0] !== '.html')
      ) {
        e.preventDefault()
        // if (pathname !== currentUrl.pathname) {
        //   nprogress.start()
        // }
      }
    },
    { capture: true },
  )

  // unregister sw
  navigator?.serviceWorker?.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
})
</script>

<template>
  <div class="App">
    <VPSkipLink />
    <VPOverlay
      class="overlay"
      :show="isSidebarOpen"
      @click="toggleSidebar(false)"
    />
    <VPNav />
    <VPSubNav
      v-if="hasSidebar"
      :is-sidebar-open="isSidebarOpen"
      @open-menu="toggleSidebar(true)"
    />
    <VPSidebar :open="isSidebarOpen" @close="toggleSidebar(false)">
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </VPSidebar>
    <VPContent :is-sidebar-open="isSidebarOpen">
      <template #content-top>
        <slot name="content-top" />
      </template>
      <template #content-bottom>
        <slot name="content-bottom" />
      </template>
      <template #aside-top>
        <slot name="aside-top" />
      </template>
      <template #aside-mid>
        <slot name="aside-mid" />
      </template>
      <template #aside-bottom>
        <slot name="aside-bottom" />
      </template>
    </VPContent>
  </div>
</template>
