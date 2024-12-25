import type { Component } from 'vue'
import ApiBooleanType from './components/globals/vp-api-bool.vue'
import ApiEnumType from './components/globals/vp-api-enum.vue'
import ApiExternalType from './components/globals/vp-api-external.vue'
import ApiFunctionType from './components/globals/vp-api-function.vue'
import ApiNumberType from './components/globals/vp-api-number.vue'
import ApiRefType from './components/globals/vp-api-ref.vue'
import ApiStringType from './components/globals/vp-api-string.vue'
import ApiTyping from './components/globals/vp-api-typing.vue'
import VPDemo from './components/vp-demo.vue'

export { default } from './components/vp-app.vue'

export const globals: [string, Component][] = [
  ['Demo', VPDemo],
  ['ApiTyping', ApiTyping],
  ['FunctionType', ApiFunctionType],
  ['EnumType', ApiEnumType],
  ['BooleanType', ApiBooleanType],
  ['StringType', ApiStringType],
  ['NumberType', ApiNumberType],
  ['RefType', ApiRefType],
  ['ExternalType', ApiExternalType],
]
