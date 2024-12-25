---
layout: home
page: true

hero:
  name: Formily Element Plus
  image:
    src: /logo.svg
    alt: Formily Element Plus
  tagline: 另一个 @formily/element-plus 组件库
  actions:
    - theme: alt
      text: Why?
      link: /getting-started
    - theme: brand
      text: 组件总览
      link: ./component/overview

features:
  - title: 💡 融合的组件风格
    details: 在组件风格上更倾向于Element Plus, 组件配置项更倾向于Formily，对两者冲突的配置项采取均衡的取舍，保证灵活性和风格的统一。
  - title: 🔌 自由的依赖版本
    details: formily及element-plus的版本都作为peerDependencies，可以根据项目需要选择自己需要的element-plus版本。
  - title: 🔑 完善的表单组件
    details: 补全element-plus的表单组件。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
