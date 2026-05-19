export function formatNumber(num: number | string, decimals = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '0'
  
  if (n >= 100000000) {
    return (n / 100000000).toFixed(decimals) + '亿'
  } else if (n >= 10000) {
    return (n / 10000).toFixed(decimals) + '万'
  } else {
    return n.toFixed(decimals)
  }
}

export function formatCurrency(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '¥0'
  return '¥' + formatNumber(n, 2)
}

export function formatPercent(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '0%'
  const sign = n >= 0 ? '+' : ''
  return sign + n.toFixed(2) + '%'
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}
