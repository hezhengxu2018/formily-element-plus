;(() => {
  const supportedLangs = globalThis.supportedLangs
  const cacheKey = 'preferred_lang'
  const defaultLang = 'zh-CN'
  // docs supported languages
  const langAlias = {
    cn: 'zh-CN',
  }
  let userPreferredLang = localStorage.getItem(cacheKey) || navigator.language
  const language
    = langAlias[userPreferredLang]
      || (supportedLangs.includes(userPreferredLang)
        ? userPreferredLang
        : defaultLang)
  localStorage.setItem(cacheKey, language)
  userPreferredLang = language
  if (!location.pathname.startsWith(`/${userPreferredLang}`)) {
    const toPath = `/${userPreferredLang}/${location.pathname.split('/').slice(2)}`
    location.pathname
      = toPath.endsWith('.html') || toPath.endsWith('/')
        ? toPath
        : [...toPath, '/']
  }
  if (navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'LANG',
      lang: userPreferredLang,
    })
  }
})()
