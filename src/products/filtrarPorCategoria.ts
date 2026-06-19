import type { Product } from './Product'

export function filtrarPorCategoria(cat: string, productos: Product[]) {
  const resultado = []
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].cat === cat) {
      resultado.push(productos[i])
    }
  }
  return resultado
}
