<template>
  <div class="spsr-container">
    <div
      v-for="item of []"
      :key="item"
      class="spsr-item"
    >
      {{ item }}
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 640px) {
  .spsr-container {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .spsr-container {
    padding: 0 64px;
  }
}
.spsr-container {
  --max-width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--max-width), 1fr));
  column-gap: 20px;
  position: relative;
  padding: 0 24px;
  margin-bottom: 60px;
}

.spsr-container {
  --max-width: 180px;
}

.spsr-item {
  margin: 2px 0;
  background-color: var(--vp-c-bg-soft);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  transition: background-color 0.2s ease;
  height: calc(var(--max-width) / 2 - 6px);
  box-shadow: var(--el-box-shadow-light);
  user-select: none;
}
</style>
