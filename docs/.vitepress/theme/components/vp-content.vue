<script setup lang="ts">
// import nprogress from 'nprogress'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import { useSidebar } from '../composables/sidebar'
import VPDocContent from './vp-doc-content.vue'
import VPHeroContent from './vp-hero-content.vue'
import VPNotFound from './vp-not-found.vue'

// const props = defineProps<{ isSidebarOpen: boolean }>()
const { frontmatter } = useData()
const route = useRoute()
const isNotFound = computed(() => route.data.description === 'Not Found')
const isHeroPost = computed(() => frontmatter.value.page === true)
const { hasSidebar } = useSidebar()

// const shouldUpdateProgress = ref(true)

// watch(
//   () => props.isSidebarOpen,
//   (val) => {
//     // delay the flag update since watch is called before onUpdated
//     nextTick(() => {
//       shouldUpdateProgress.value = !val
//     })
//   },
// )

// onUpdated(() => {
//   if (shouldUpdateProgress.value) {
//     nprogress.done()
//   }
// })
</script>

<template>
  <main
    id="page-content"
    class="page-content" :class="{ 'has-sidebar': hasSidebar }"
  >
    <VPNotFound v-if="isNotFound" />
    <VPHeroContent v-else-if="isHeroPost" />
    <VPDocContent v-else>
      <template #content-top>
        <slot name="content-top" />
      </template>
      <template #content-bottom>
        <slot name="content-bottom" />
      </template>
    </VPDocContent>
  </main>
</template>
