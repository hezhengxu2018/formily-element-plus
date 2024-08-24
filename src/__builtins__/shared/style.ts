export function getStyleNumber(value: string | number) {
  const num = Number(value)
  return Number.isNaN(num) ? value : `${value}px`
}
