import type { Product } from './Product'

export function filtrarPorCategoria(cat: string, productos: Product[]): Product[] {
  if (cat === 'todos') return productos
  return productos.filter(p => p.cat === cat)
}
