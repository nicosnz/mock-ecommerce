import { addToCart } from './cart/AddtoCart'
import type { Cart } from './cart/Cart'
import { updateCartCount } from './cart/updateCartCount'
import type { EstadoPedido } from './pedidos/Pedido'
import { actualizarEstadoPedido, crearPedido, obtenerPedidos } from './pedidos/pedidosService'
import { addProduct } from './products/addProduct'
import { filterCat } from './products/filterCategory'
import type { Product } from './products/Product'
import { construirCatalogo } from './products/construirCatalogo'
import { obtenerDetalle } from './products/obtenerDetalle'
import { eliminarProducto, guardarProducto, obtenerProductos } from './products/productosService'
import { showToast } from './shared/Toast'

let cart: Cart[] = []
let productos: Product[] = []
let pedidosList: ReturnType<typeof obtenerPedidos> extends Promise<infer T> ? T : never[] = []
let editingId: number | null = null
let activePedidoId: string | null = null

async function cargarProductos() {
  productos = await obtenerProductos()
}

async function cargarPedidos() {
  pedidosList = await obtenerPedidos()
}

async function showPage(name: string) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'))
  document.getElementById('page-' + name)!.classList.add('active')
  const navEl = document.getElementById('nav-' + name)
  if (navEl) navEl.classList.add('active')

  if (name === 'catalogo') {
    await cargarProductos()
    renderCatalog(productos)
  }
  if (name === 'gestion') {
    await cargarProductos()
    renderTable()
  }
  if (name === 'pedidos-comerciante') {
    await cargarPedidos()
    renderPedidos()
  }
  if (name === 'pedido') renderCart()
}

function renderCatalog(items: Product[]) {
  const g = document.getElementById('catalog-grid')!
  g.innerHTML = construirCatalogo(items)
}

function filtrarCategoria(cat: string, btn: HTMLButtonElement) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  renderCatalog(filterCat(cat, productos))
}

// ─── DETALLE ───
function showDetail(id: number) {
  const p = obtenerDetalle(id, productos)
  if (!p) return

  const detail_emoji  = document.getElementById('detail-emoji')
  const detail_cat    = document.getElementById('detail-cat')
  const detail_name   = document.getElementById('detail-name')
  const detail_price  = document.getElementById('detail-price')
  const detail_stock  = document.getElementById('detail-stock')
  const detail_desc   = document.getElementById('detail-desc')

  if (!detail_emoji || !detail_cat || !detail_name || !detail_price || !detail_stock || !detail_desc) return

  detail_emoji.textContent = p.emoji!
  detail_cat.textContent   = p.cat
  detail_name.textContent  = p.nombre
  detail_price.textContent = `Bs. ${p.precio}`
  detail_stock.textContent = `📦 ${p.stock} en stock`
  detail_desc.textContent  = p.desc

  const detail_add_btn = document.getElementById('detail-add-btn')
  if (!detail_add_btn) return
  detail_add_btn.onclick = () => {
    addProductToCart(id)
  }

  const detail_opinions = document.getElementById('detail-opinions')
  if (!detail_opinions) return

  detail_opinions.innerHTML = p.opinions?.length
    ? p.opinions.map(o => `
        <div class="opinion-card">
          <div class="opinion-header">
            <span class="opinion-author">${o.autor}</span>
            <span class="stars">${'★'.repeat(o.estrellas)}${'☆'.repeat(5 - o.estrellas)}</span>
          </div>
          <div class="opinion-text">${o.texto}</div>
        </div>`).join('')
    : '<p style="color:var(--muted);font-size:0.88rem">Aún no hay opiniones.</p>'

  showPage('detalle')
}

// ─── CARRITO ───
function addProductToCart(id: number) {
  const updatedCart = addToCart(id, productos, cart)
  if (!updatedCart) {
    showToast('No hay stock disponible')
    return
  }
  cart = updatedCart
  const producto = productos.find(p => p.id === id)
  updateCartTotal(cart)
  if (producto) showToast(`"${producto.nombre}" agregado al pedido ✓`)
}

export function updateCartTotal(cart: Cart[]) {
  const total = updateCartCount(cart)
  const cart_count = document.getElementById('cart-count')
  if (!cart_count) return
  cart_count.textContent = String(total)
}

export function renderCart() {
  const container = document.getElementById('cart-items')
  const summary   = document.getElementById('cart-summary-block')
  if (!container || !summary) return

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <span class="big-emoji">🛒</span>
        <p>Tu pedido está vacío.</p>
        <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--muted)">Explorá el catálogo y agregá productos.</p>
      </div>`
    summary.innerHTML = ''
    return
  }

  container.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-emoji">${i.producto.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.producto.nombre}</div>
        <div class="cart-item-price">Bs. ${i.producto.precio} c/u</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${i.producto.id}, -1)">−</button>
        <span class="qty-num">${i.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i.producto.id}, 1)">+</button>
      </div>
      <div class="cart-item-total">Bs. ${i.producto.precio * i.qty}</div>
      <button class="remove-btn" onclick="removeFromCart(${i.producto.id})">✕</button>
    </div>
  `).join('')

  const total = cart.reduce((s, i) => s + i.producto.precio * i.qty, 0)
  summary.innerHTML = `
    <div class="cart-summary">
      <div>
        <div class="cart-total-label">Total del pedido</div>
        <div class="cart-total-num">Bs. ${total}</div>
      </div>
      <button class="confirm-btn" onclick="confirmPedido()">Confirmar Pedido →</button>
    </div>`
}

function changeQty(id: number, delta: number) {
  const item = cart.find(i => i.producto.id === id)
  if (!item) return

  if (delta > 0) {
    const producto = productos.find(p => p.id === id)
    if (!producto || producto.stock <= 0) {
      showToast('No hay más stock disponible')
      return
    }
    producto.stock--
  } else {
    const producto = productos.find(p => p.id === id)
    if (producto) producto.stock++
  }

  const newQty = item.qty + delta
  cart = newQty <= 0
    ? cart.filter(i => i.producto.id !== id)
    : cart.map(i => i.producto.id === id ? { ...i, qty: newQty } : i)

  updateCartTotal(cart)
  renderCart()
}

function removeFromCart(id: number) {
  const item = cart.find(i => i.producto.id === id)
  if (item) {
    const producto = productos.find(p => p.id === id)
    if (producto) producto.stock += item.qty
  }
  cart = cart.filter(i => i.producto.id !== id)
  updateCartTotal(cart)
  renderCart()
}

async function confirmPedido() {
  if (!cart.length) return
  const result = await crearPedido(cart)
  if (!result.ok) {
    showToast(result.message)
    return
  }
  cart = []
  updateCartTotal(cart)
  renderCart()
  showToast(result.message)
}

// ─── TABLA DE GESTIÓN ───
export function renderTable() {
  const products_tbody = document.getElementById('products-tbody')
  if (!products_tbody) return

  products_tbody.innerHTML = productos.map(p => `
    <tr>
      <td><span class="table-emoji">${p.emoji}</span></td>
      <td><strong>${p.nombre}</strong></td>
      <td>${p.cat}</td>
      <td>Bs. ${p.precio}</td>
      <td>${p.stock}</td>
      <td>
        <button class="edit-btn" onclick="editProduct(${p.id})">Editar</button>
        <button class="del-btn" onclick="deleteProduct(${p.id})">Eliminar</button>
      </td>
    </tr>
  `).join('')
}

function editProduct(id: number) {
  const p = productos.find(x => x.id === id)
  if (!p) return
  editingId = id

  ;(document.getElementById('form-nombre') as HTMLInputElement).value  = p.nombre
  ;(document.getElementById('form-desc')   as HTMLInputElement).value  = p.desc
  ;(document.getElementById('form-precio') as HTMLInputElement).value  = String(p.precio)
  ;(document.getElementById('form-stock')  as HTMLInputElement).value  = String(p.stock)
  ;(document.getElementById('form-cat')    as HTMLInputElement).value  = p.cat
  ;(document.getElementById('form-emoji')  as HTMLInputElement).value  = p.emoji!

  ;(document.getElementById('modal-title')   as HTMLElement).textContent = 'Editar Producto'
  ;(document.getElementById('modal-overlay') as HTMLElement).classList.add('open')
}

// ─── MODAL ───
function openModal() {
  editingId = null

  ;(document.getElementById('form-nombre') as HTMLInputElement).value = ''
  ;(document.getElementById('form-desc')   as HTMLInputElement).value = ''
  ;(document.getElementById('form-precio') as HTMLInputElement).value = ''
  ;(document.getElementById('form-stock')  as HTMLInputElement).value = ''
  ;(document.getElementById('form-cat')    as HTMLInputElement).value = ''
  ;(document.getElementById('form-emoji')  as HTMLInputElement).value = ''

  ;(document.getElementById('modal-title')   as HTMLElement).textContent = 'Agregar Producto'
  ;(document.getElementById('modal-overlay') as HTMLElement).classList.add('open')
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open')
}

export async function deleteProduct(id: number) {
  const result = await eliminarProducto(id)
  if (!result.ok) {
    showToast(result.message)
    return
  }
  productos = productos.filter(p => p.id !== id)
  renderTable()
  showToast(result.message)
}

async function saveProduct() {
  const nombre = (document.getElementById('form-nombre') as HTMLInputElement).value.trim()
  const precio = parseFloat((document.getElementById('form-precio') as HTMLInputElement).value)
  const stock  = parseInt((document.getElementById('form-stock')   as HTMLInputElement).value)
  const cat    = (document.getElementById('form-cat')    as HTMLInputElement).value
  const desc   = (document.getElementById('form-desc')   as HTMLInputElement).value.trim()
  const emoji  = (document.getElementById('form-emoji')  as HTMLInputElement).value.trim()

  const validacion = addProduct(nombre, precio, stock, cat)
  if (!validacion.ok) {
    showToast(validacion.message)
    return
  }

  const result = await guardarProducto({ nombre, desc, precio, stock, cat, emoji: emoji || '📦' }, editingId)
  showToast(result.message)

  if (result.ok) {
    closeModal()
    await cargarProductos()
    renderTable()
  }
}

// ─── PEDIDOS COMERCIANTE ───
function renderPedidos() {
  const estadoClass: Record<string, string> = {
    'Pendiente':   'estado-pendiente',
    'En proceso':  'estado-en-proceso',
    'Entregado':   'estado-entregado',
  }

  document.getElementById('pedidos-list')!.innerHTML = pedidosList.map(p => {
    const total = p.items.reduce((s, i) => s + i.precio * i.qty, 0)
    return `
      <div class="pedido-card" onclick="openPedidoModal('${p.id}')">
        <div class="pedido-card-header">
          <span class="pedido-id">Pedido #${p.id}</span>
          <span class="estado-badge ${estadoClass[p.estado] ?? 'estado-pendiente'}">${p.estado}</span>
        </div>
        <div class="pedido-items">${p.items.map(i => `${i.nombre} x${i.qty}`).join(' · ')}</div>
        <div class="pedido-total">Total: Bs. ${total}</div>
      </div>`
  }).join('')
}

function openPedidoModal(id: string) {
  const p = pedidosList.find(x => x.id === id)
  if (!p) return
  activePedidoId = id

  const total = p.items.reduce((s, i) => s + i.precio * i.qty, 0)
  document.getElementById('pm-id')!.textContent      = `Pedido #${p.id}`
  document.getElementById('pm-cliente')!.textContent = p.cliente
  document.getElementById('pm-items')!.innerHTML     = p.items.map(i => `
    <div class="pedido-detail-item">
      <span>${i.nombre} <span style="color:var(--muted)">x${i.qty}</span></span>
      <span style="font-weight:600">Bs. ${i.precio * i.qty}</span>
    </div>`).join('')
  document.getElementById('pm-total')!.textContent = `Bs. ${total}`

  const sel = document.getElementById('pm-status')
  if (!sel) return
  sel.innerHTML = ['Pendiente', 'En proceso', 'Entregado']
    .map(e => `<option ${e === p.estado ? 'selected' : ''}>${e}</option>`).join('')

  document.getElementById('pedido-modal-overlay')!.classList.add('open')
}

function closePedidoModal() {
  document.getElementById('pedido-modal-overlay')!.classList.remove('open')
}

async function updatePedidoStatus() {
  if (!activePedidoId) return
  const pm_status = document.getElementById('pm-status') as HTMLSelectElement
  if (!pm_status) return

  const result = await actualizarEstadoPedido(activePedidoId, pm_status.value as EstadoPedido)
  if (!result.ok) {
    showToast(result.message)
    return
  }

  await cargarPedidos()
  renderPedidos()
  closePedidoModal()
  showToast('Estado actualizado ✓')
}

// ─── INIT ───
async function init() {
  document.getElementById('modal-overlay')!.addEventListener('click', function (e) {
    if (e.target === this) closeModal()
  })
  document.getElementById('pedido-modal-overlay')!.addEventListener('click', function (e) {
    if (e.target === this) closePedidoModal()
  })

  await cargarProductos()
  renderCatalog(productos)
}

init()

;(window as any).showPage           = showPage
;(window as any).filterCat          = filtrarCategoria
;(window as any).showDetail         = showDetail
;(window as any).openModal          = openModal
;(window as any).closeModal         = closeModal
;(window as any).saveProduct        = saveProduct
;(window as any).editProduct        = editProduct
;(window as any).deleteProduct      = deleteProduct
;(window as any).addProductToCart   = addProductToCart
;(window as any).changeQty          = changeQty
;(window as any).removeFromCart     = removeFromCart
;(window as any).confirmPedido      = confirmPedido
;(window as any).openPedidoModal    = openPedidoModal
;(window as any).updatePedidoStatus = updatePedidoStatus
;(window as any).closePedidoModal   = closePedidoModal
