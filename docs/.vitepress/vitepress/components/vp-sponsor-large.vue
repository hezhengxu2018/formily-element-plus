<script setup lang="ts">
defineProps({
  itemClass: String,
  itemStyle: [String, Object, Array],
})
</script>

<template>
  <div />
</template>

<style scoped lang="scss">
@use '../styles/mixins.scss' as *;

.sponsor-item {
  margin-bottom: 8px;
  height: 60px;
  width: 196px;

  @include respond-to('max') {
    width: 236px;
    height: 72px;
  }

  @media (max-width: 767px) {
    width: 236px;
    height: 72px;
  }

  img {
    border-radius: 8px;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .sponsor-item {
    img {
      border-radius: 4px;
      min-height: 45px;
    }
  }
}
</style>
