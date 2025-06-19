// Helper functions for market data processing
export function safeGetChangePercent(item: any): number {
  if (!item) return 0;
  
  const changePercent = item.change_percent || item.changePercent;
  if (changePercent === undefined || changePercent === null) return 0;
  
  if (typeof changePercent === 'string') {
    return parseFloat(
      typeof changePercent === 'string' ? changePercent.replace(/[+%]/g, '') : ''
    ) || 0;
  }
  
  return parseFloat(changePercent) || 0;
}

export function safeGetPrice(item: any): number {
  if (!item) return 0;
  return parseFloat(item.price) || 0;
}

export function safeGetChange(item: any): number {
  if (!item) return 0;
  return parseFloat(item.change) || 0;
}

export function isPositiveChange(item: any): boolean {
  return safeGetChangePercent(item) > 0;
}