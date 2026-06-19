import { describe, expect, it } from 'vitest'
import { construirCatalogo } from '../../src/products/construirCatalogo'
import type { Product } from '../../src/products/Product'

describe('Explorar Catalogo', () => {

  it('Dado que no hay productos, muestra un mensaje que informa al usuario que no hay productos', () => {
    const html = construirCatalogo([])
    expect(html).toContain('No hay productos disponibles')
  })

})
