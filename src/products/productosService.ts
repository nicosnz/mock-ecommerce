import type { Result } from '../shared/Result'
import type { Product } from './Product'
import { repositorioProductos } from './SupabaseRepositorioProductos'

export async function obtenerProductos(): Promise<Product[]> {
  return repositorioProductos.obtenerTodos()
}

export async function guardarProducto(
  producto: Omit<Product, 'id' | 'opinions'>,
  editingId: number | null
): Promise<Result> {
  return editingId
    ? repositorioProductos.actualizar(editingId, producto)
    : repositorioProductos.insertar(producto)
}

export async function eliminarProducto(id: number): Promise<Result> {
  return repositorioProductos.eliminar(id)
}

export async function actualizarStock(id: number, nuevoStock: number): Promise<void> {
  return repositorioProductos.actualizarStock(id, nuevoStock)
}
