import { supabase } from '../../supabase/supabase'
import type { Result } from '../shared/Result'
import type { EstadoPedido, Pedido } from './Pedido'
import type { IRepositorioPedidos, ItemPedido } from './IRepositorioPedidos'

class SupabaseRepositorioPedidos implements IRepositorioPedidos {
  async obtenerTodos(): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, pedido_items(*)')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data ?? []).map(fila => ({
      id: String(fila.id),
      cliente: fila.cliente,
      estado: fila.estado as EstadoPedido,
      items: (fila.pedido_items ?? []).map((i: any) => ({
        nombre: i.nombre,
        qty: i.qty,
        precio: i.precio,
      })),
    }))
  }

  async insertar(cliente: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('pedidos')
      .insert({ cliente, estado: 'Pendiente' })
      .select('id')
      .single()

    if (error || !data) return null
    return data.id
  }

  async insertarItems(pedidoId: number, items: ItemPedido[]): Promise<Result> {
    const filas = items.map(i => ({ pedido_id: pedidoId, ...i }))
    const { error } = await supabase.from('pedido_items').insert(filas)
    if (error) return { ok: false, message: 'Error al guardar los ítems del pedido.' }
    return { ok: true, message: '' }
  }

  async actualizarEstado(id: string, estado: EstadoPedido): Promise<Result> {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', Number(id))

    if (error) return { ok: false, message: 'Error al actualizar el estado.' }
    return { ok: true, message: 'Estado actualizado.' }
  }
}

export const repositorioPedidos: IRepositorioPedidos = new SupabaseRepositorioPedidos()
