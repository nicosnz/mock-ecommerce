import type { Product } from './Product'

export function construirCatalogo(items: Product[]): string {
  if (!items.length) {
    return '<p class="empty-catalog">No hay productos disponibles</p>'
  }
  return items.map(p => `
    <div class="product-card" onclick="showDetail(${p.id})">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.nombre}</div>
        <div class="product-desc">${p.desc.slice(0, 70)}...</div>
        <div class="product-footer">
          <div class="product-price">Bs. ${p.precio}</div>
          <button class="add-btn" onclick="event.stopPropagation(); addProductToCart(${p.id})">+ Agregar</button>
        </div>
      </div>
    </div>
  `).join('')
}
