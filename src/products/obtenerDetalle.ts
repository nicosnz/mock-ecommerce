import type { Product } from './Product'

export function obtenerDetalle(id: number, productos: Product[]): Product | null {
  return productos.find(p => p.id === id) ?? null
}
