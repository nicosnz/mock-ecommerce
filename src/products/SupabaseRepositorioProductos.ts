import { supabase } from '../../supabase/supabase'
import type { Product } from './Product'
import type { DatosProducto, IRepositorioProductos } from './IRepositorioProductos'
import type { Result } from '../shared/Result'

function mapearProducto(fila: any): Product {
  return {
    id: fila.id,
    nombre: fila.nombre,
    desc: fila.description ?? '',
    precio: fila.precio,
    stock: fila.stock,
    cat: fila.cat,
    emoji: fila.emoji ?? '📦',
    opinions: fila.opinions ?? [],
  }
}

function aFila(datos: DatosProducto) {
  return {
    nombre: datos.nombre,
    description: datos.desc,
    precio: datos.precio,
    stock: datos.stock,
    cat: datos.cat,
    emoji: datos.emoji ?? '📦',
  }
}

class SupabaseRepositorioProductos implements IRepositorioProductos {
  async obtenerTodos(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, opinions(*)')
      .order('id')

    if (error) throw error
    return (data ?? []).map(mapearProducto)
  }

  async insertar(datos: DatosProducto): Promise<Result> {
    const { error } = await supabase.from('products').insert(aFila(datos))
    if (error) return { ok: false, message: 'Error al guardar el producto.' }
    return { ok: true, message: 'Producto agregado con éxito ✓' }
  }

  async actualizar(id: number, datos: DatosProducto): Promise<Result> {
    const { error } = await supabase.from('products').update(aFila(datos)).eq('id', id)
    if (error) return { ok: false, message: 'Error al actualizar el producto.' }
    return { ok: true, message: 'Producto actualizado ✓' }
  }

  async eliminar(id: number): Promise<Result> {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { ok: false, message: 'Error al eliminar el producto.' }
    return { ok: true, message: 'Producto eliminado.' }
  }

  async actualizarStock(id: number, nuevoStock: number): Promise<void> {
    await supabase.from('products').update({ stock: nuevoStock }).eq('id', id)
  }
}

export const repositorioProductos: IRepositorioProductos = new SupabaseRepositorioProductos()
