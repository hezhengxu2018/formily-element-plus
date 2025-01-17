import type { PageData } from 'vitepress'
import { useData } from 'vitepress'

import { computed } from 'vue'

type EnhanceArrayElement<T, P> = T extends Array<infer U> ? (U & P)[] : never

type Headers = EnhanceArrayElement<
  PageData['headers'],
  {
    children?: Headers
  }
>

export function useToc() {
  const { page } = useData()

  return computed(() => resolveHeaders(page.value.headers))
}

export function resolveHeaders(headers: PageData['headers']) {
  return mapHeaders(groupHeaders(headers))
}

export function groupHeaders(headers: PageData['headers']) {
  headers = headers.map(h => Object.assign({}, h))
  let lastH2

  for (const h of headers) {
    if (h.level === 2) {
      lastH2 = h
    }
    else if (lastH2) {
      ;(lastH2.children || (lastH2.children = [])).push(h)
    }
  }
  return headers.filter(h => h.level === 2)
}

export function mapHeaders(headers: Headers) {
  return headers.map(header => ({
    text: header.title,
    link: `#${header.slug}`,
    children: header.children ? mapHeaders(header.children) : undefined,
  }))
}
