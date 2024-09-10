<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import VPFeature from './vp-feature.vue'

export interface Feature {
  icon?: DefaultTheme.FeatureIcon
  title: string
  details: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
}

const props = defineProps<{
  features: Feature[]
}>()
</script>

<template>
  <div v-if="features" class="vp-features">
    <div class="container">
      <div class="items">
        <div v-for="feature in props.features" :key="feature.title" class="item grid-3">
          <VPFeature
            :icon="feature.icon" :title="feature.title" :details="feature.details" :link="feature.link"
            :link-text="feature.linkText" :rel="feature.rel" :target="feature.target"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-features {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .vp-features {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .vp-features {
    padding: 0 64px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {

  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {

  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}
</style>
