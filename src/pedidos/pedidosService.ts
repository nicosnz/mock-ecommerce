import type { Cart } from '../cart/Cart'
import type { Result } from '../shared/Result'
import type { EstadoPedido, Pedido } from './Pedido'
import { repositorioPedidos } from './SupabaseRepositorioPedidos'
import { repositorioProductos } from '../products/SupabaseRepositorioProductos'

export async function obtenerPedidos(): Promise<Pedido[]> {
  return repositorioPedidos.obtenerTodos()
}

export async function actualizarEstadoPedido(
  id: string,
  estado: EstadoPedido
): Promise<Result> {
  return repositorioPedidos.actualizarEstado(id, estado)
}

export async function crearPedido(cart: Cart[]): Promise<Result> {
  const pedidoId = await repositorioPedidos.insertar('Cliente Online')
  if (!pedidoId) return { ok: false, message: 'Error al crear el pedido.' }

  const items = cart.map(i => ({
    nombre: i.producto.nombre,
    precio: i.producto.precio,
    qty: i.qty,
  }))

  const resultItems = await repositorioPedidos.insertarItems(pedidoId, items)
  if (!resultItems.ok) return resultItems

  const productosActuales = await repositorioProductos.obtenerTodos()
  for (const item of cart) {
    const prod = productosActuales.find(p => p.id === item.producto.id)
    if (prod) {
      await repositorioProductos.actualizarStock(
        item.producto.id,
        Math.max(0, prod.stock - item.qty)
      )
    }
  }

  return { ok: true, message: '¡Pedido confirmado con éxito! 🎉' }
}
