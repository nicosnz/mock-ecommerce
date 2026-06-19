import { describe, expect, it } from 'vitest'
import { construirCatalogo } from '../../src/products/construirCatalogo'
import { filtrarPorCategoria } from '../../src/products/filtrarPorCategoria'
import type { Product } from '../../src/products/Product'

const productosEjemplo: Product[] = [
  { id: 1, nombre: 'Salteñas',  cat: 'Alimentos', desc: '', precio: 10, stock: 5 },
  { id: 2, nombre: 'Singani',   cat: 'Bebidas',   desc: '', precio: 85, stock: 3 },
  { id: 3, nombre: 'Tucumanas', cat: 'Alimentos', desc: '', precio:  8, stock: 10 },
]

describe('Explorar Catalogo', () => {

  it('Dado que no hay productos, muestra un mensaje que informa al usuario que no hay productos', () => {
    const html = construirCatalogo([])
    expect(html).toContain('No hay productos disponibles')
  })

  it('Dado que hay productos de distintas categorías, solo muestra los de la categoría seleccionada', () => {
    const resultado = filtrarPorCategoria('Alimentos', productosEjemplo)

    expect(resultado).toHaveLength(2)
  })

})
