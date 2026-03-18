export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function parseQuantity(text: string): number {
  const num = parseInt(text.trim(), 10)
  return isNaN(num) || num <= 0 ? 1 : num
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
