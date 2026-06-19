import type { Product } from './Product'

export function obtenerDetalle(id: number, productos: Product[]) {
  let encontrado = null
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id == id) {
      encontrado = productos[i]
    }
  }
  return encontrado
}
