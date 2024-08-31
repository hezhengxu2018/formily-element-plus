<template>
  <div />
</template>

<style scoped lang="scss">
@use '../styles/mixins' as *;
div {
  display: flex;
  align-items: center;
  .sponsor-item {
    margin-right: 4px;
    height: 36px;
    width: 36px;

    @include respond-to('max') {
      height: 44px;
      width: 44px;
    }

    @media (max-width: 767px) {
      width: 44px;
      height: 44px;
    }

    img {
      height: 100%;
      width: 100%;
    }
  }

  @include respond-to('xs') {
    width: 196px;
  }
}
</style>
