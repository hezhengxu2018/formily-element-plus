;(() => {
  const saved = localStorage.getItem('vitepress-theme-appearance')
  if (
    saved === 'auto'
      ? window.matchMedia(`(prefers-color-scheme: dark)`).matches
      : saved === 'dark'
  ) {
    document.documentElement.classList.add('dark')
  }
})()
