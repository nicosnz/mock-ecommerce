import { describe, expect, it } from 'vitest'
import type { Product } from '../../src/products/Product'

const productos: Product[] = [
  {
    id: 1,
    nombre: 'Salteñas artesanales',
    desc: 'Elaboradas con masa crujiente',
    precio: 12,
    stock: 30,
    cat: 'Alimentos',
    emoji: '🥟',
    opinions: [
      { autor: 'Nicolasin', estrellas: 5, texto: 'Muy buenas' }
    ]
  },
  {
    id: 2,
    nombre: 'Singani artesanal',
    desc: 'Destilado de uva moscatel',
    precio: 85,
    stock: 20,
    cat: 'Bebidas',
    emoji: '🍾',
    opinions: []
  }
]

describe('Detalle de Producto', () => {

  it('Dado que el cliente accede al detalle, retorna nombre, precio, descripción y stock del producto', () => {
    const detalle = obtenerDetalle(1, productos)

    expect(detalle).not.toBeNull()
    expect(detalle?.nombre).toBe('Salteñas artesanales')
    expect(detalle?.precio).toBe(12)
    expect(detalle?.desc).toBe('Elaboradas con masa crujiente')
    expect(detalle?.stock).toBe(30)
  })

  it('Dado que el cliente accede al detalle, también retorna la lista de opiniones', () => {
    const detalle = obtenerDetalle(1, productos)

    expect(detalle?.opinions).toHaveLength(1)
    expect(detalle?.opinions?.[0].autor).toBe('Nicolasin')
  })

  it('Dado que el producto no existe, retorna null', () => {
    const detalle = obtenerDetalle(99, productos)

    expect(detalle).toBeNull()
  })

})
