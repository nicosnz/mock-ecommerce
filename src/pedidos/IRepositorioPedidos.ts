import type { Result } from '../shared/Result'
import type { EstadoPedido, Pedido } from './Pedido'

export type ItemPedido = {
  nombre: string
  precio: number
  qty: number
}

export interface IRepositorioPedidos {
  obtenerTodos(): Promise<Pedido[]>
  insertar(cliente: string): Promise<number | null>
  insertarItems(pedidoId: number, items: ItemPedido[]): Promise<Result>
  actualizarEstado(id: string, estado: EstadoPedido): Promise<Result>
}
