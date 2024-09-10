<script setup lang="ts">
import { useToc } from '../../composables/use-toc'

const headers = useToc()
</script>

<template>
  <aside class="toc-wrapper">
    <nav class="toc-content">
      <h3 class="toc-content__heading">
        Contents
      </h3>
      <el-anchor :offset="70" :bound="120">
        <el-anchor-link
          v-for="{ link, text, children } in headers"
          :key="link"
          :href="link"
          :title="text"
        >
          <div v-html="text" />
          <template v-if="children" #sub-link>
            <el-anchor-link
              v-for="{ link: childLink, text: childText } in children"
              :key="childLink"
              :href="childLink"
              :title="text"
            >
              <div v-html="childText" />
            </el-anchor-link>
          </template>
        </el-anchor-link>
      </el-anchor>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.sponsors-button {
  :deep(button) {
    width: 100%;
  }
}
</style>
