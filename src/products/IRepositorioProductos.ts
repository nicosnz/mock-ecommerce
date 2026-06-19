import type { Result } from '../shared/Result'
import type { Product } from './Product'

export type DatosProducto = Omit<Product, 'id' | 'opinions'>

export interface IRepositorioProductos {
  obtenerTodos(): Promise<Product[]>
  insertar(datos: DatosProducto): Promise<Result>
  actualizar(id: number, datos: DatosProducto): Promise<Result>
  eliminar(id: number): Promise<Result>
  actualizarStock(id: number, nuevoStock: number): Promise<void>
}
