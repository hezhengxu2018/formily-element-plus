<script setup lang="ts">
import { computed } from 'vue'
import ApiTyping from './vp-api-typing.vue'

const props = defineProps({
  values: {
    type: Array,
    required: true,
  },
})

const processString = (s: unknown) => (typeof s === 'string' ? `'${s}'` : s)

const details = computed(() => props.values.map(processString).join(' | '))
</script>

<template>
  <ApiTyping type="enum" :details="details" />
</template>
