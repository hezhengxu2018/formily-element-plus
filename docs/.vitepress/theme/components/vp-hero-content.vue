<script setup lang="ts">
import { useData } from 'vitepress'
import VPHero from './vp-hero.vue'
import VPHomeFeatures from './vp-home-features.vue'

const { frontmatter: fm } = useData()
</script>

<template>
  <VPHero
    v-if="fm.hero" class="hero-content" :name="fm.hero.name" :text="fm.hero.text" :tagline="fm.hero.tagline"
    :image="fm.hero.image" :actions="fm.hero.actions"
  >
    <template #home-hero-info-before>
      <slot name="home-hero-info-before" />
    </template>
    <template #home-hero-info>
      <slot name="home-hero-info" />
    </template>
    <template #home-hero-info-after>
      <slot name="home-hero-info-after" />
    </template>
    <template #home-hero-actions-after>
      <slot name="home-hero-actions-after" />
    </template>
  </VPHero>
  <VPHomeFeatures />
  <div class="vp-doc container">
    <!-- <Content /> -->
  </div>
  <el-divider style="margin-bottom: 0" />
  <div class="text-center py-6 text-xs">
    <p class="mb-1">
      Released under the
      <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferer">
        MIT License
      </a>.
    </p>
  </div>
</template>

<style lang="css" scoped>
.container {
  margin: 0 auto;
  margin-top: 72px;
  max-width: 1152px;
}
</style>
