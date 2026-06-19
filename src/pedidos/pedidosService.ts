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

function cartAItems(cart: Cart[]) {
  return cart.map(item => ({
    nombre: item.producto.nombre,
    precio: item.producto.precio,
    qty: item.qty,
  }))
}

async function descontarStock(cart: Cart[]): Promise<void> {
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
}

export async function crearPedido(cart: Cart[]): Promise<Result> {
  const pedidoId = await repositorioPedidos.insertar('Cliente Online')
  if (!pedidoId) return { ok: false, message: 'Error al crear el pedido.' }

  const resultado = await repositorioPedidos.insertarItems(pedidoId, cartAItems(cart))
  if (!resultado.ok) return resultado

  await descontarStock(cart)
  return { ok: true, message: '¡Pedido confirmado con éxito! 🎉' }
}
