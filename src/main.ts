import { addToCart, updateCartCount } from './cart/AddtoCart';
import type { Cart } from "./cart/Cart";
import type { EstadoPedido } from "./pedidos/Pedido";
import { findPedido, pedidos } from "./pedidos/PedidosMock";
import type { Product } from "./products/Product";
import { addProduct, delProduct, filterCat, products, type Result } from './products/ProductsMock';
import { showToast } from "./shared/Toast";



let cart:Cart[] = [];
let editingId:number | null = null;
let activePedidoId:string | null = null;


// ─── NAVIGATION ───
function showPage(name:string) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name)!.classList.add('active');
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  if (name === 'catalogo') renderCatalog(products);
  if (name === 'gestion') renderTable();
  if (name === 'pedidos-comerciante') renderPedidos();
  if (name === 'pedido') renderCart();
}

function addProductToCart(id: number) {

  const updatedCart = addToCart(
    id,
    products,
    cart
  );

  if (!updatedCart) {
    showToast("No hay stock disponible");
    return;
  }

  cart = updatedCart;

  const product = products.find(p => p.id === id);

  updateCartTotal(cart);

  if (product) {
    showToast(`"${product.nombre}" agregado al pedido ✓`);
  }
}
export function updateCartTotal(cart:Cart[]) {
  const total = updateCartCount(cart)
  
  const cart_count = document.getElementById('cart-count')
  if(!cart_count) return;
  cart_count.textContent = String(total);
}

// ─── CATALOG ───
function renderCatalog(items:Product[]) {
  const g = document.getElementById('catalog-grid')!;
  g.innerHTML = items.map(p => `
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
  `).join('');
}


function filterCate(cat:string, btn:HTMLButtonElement) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = filterCat(cat,products)
  renderCatalog(filtered);
}

// ─── DETAIL ───
function showDetail(id:number) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const detail_emoji = document.getElementById('detail-emoji');
  const detail_cat = document.getElementById('detail-cat');
  const detail_name = document.getElementById('detail-name');
  const detail_price = document.getElementById('detail-price') ;
  const detail_stock = document.getElementById('detail-stock') 
  const detail_desc = document.getElementById('detail-desc') 
  if(!detail_emoji || !detail_cat || !detail_name || !detail_price || !detail_stock || !detail_desc ) return;
  detail_emoji.textContent =  p.emoji!;
  detail_cat.textContent =p.cat;
  detail_name.textContent = p.nombre
  detail_price.textContent = `Bs. ${p.precio}`;
  detail_stock.textContent = `📦 ${p.stock} en stock`;
  detail_desc.textContent = p.desc;
  const detail_add_btn = document.getElementById('detail-add-btn')
  if(!detail_add_btn) return
  detail_add_btn.addEventListener("click", () => {
    addToCart(id,products,cart);
    showToast(`"${p.nombre}" agregado al pedido ✓`);
  });

  const detail_opinions = document.getElementById('detail-opinions');
  if(!detail_opinions) return;
  if(!p.opinions) return;
  detail_opinions.innerHTML = p.opinions.length
    ? p.opinions.map(o => `
        <div class="opinion-card">
          <div class="opinion-header">
            <span class="opinion-author">${o.autor}</span>
            <span class="stars">${'★'.repeat(o.estrellas)}${'☆'.repeat(5 - o.estrellas)}</span>
          </div>
          <div class="opinion-text">${o.texto}</div>
        </div>`).join('')
    : '<p style="color:var(--muted);font-size:0.88rem">Aún no hay opiniones.</p>';
  showPage('detalle');
}




export function renderCart() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary-block');
  if(!container || !summary) return;
  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <span class="big-emoji">🛒</span>
        <p>Tu pedido está vacío.</p>
        <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--muted)">Explorá el catálogo y agregá productos.</p>
      </div>`;
    summary.innerHTML = '';
    return;
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
  `).join('');
  const total = cart.reduce((s, i) => s + i.producto.precio * i.qty, 0);
  summary.innerHTML = `
    <div class="cart-summary">
      <div>
        <div class="cart-total-label">Total del pedido</div>
        <div class="cart-total-num">Bs. ${total}</div>
      </div>
      <button class="confirm-btn" onclick="confirmPedido()">Confirmar Pedido →</button>
    </div>`;
}






// ─── PRODUCT TABLE ───
export function renderTable() {
  const products_tbody = document.getElementById('products-tbody');
  if(!products_tbody) return;

  products_tbody.innerHTML = products.map(p => `
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
  `).join('');
}


function editProduct(id:number) {
  const p = products.find(x => x.id === id);
  if(!p) return;
  editingId = id;
  const nombre = document.getElementById('form-nombre') as HTMLInputElement;
  const desc = document.getElementById('form-desc') as HTMLInputElement;
  const precio = document.getElementById('form-precio') as HTMLInputElement;
  const stock = document.getElementById('form-stock') as HTMLInputElement;
  const cat = document.getElementById('form-cat') as HTMLInputElement;
  const emoji = document.getElementById('form-emoji') as HTMLInputElement;

  const modalTitle = document.getElementById('modal-title') as HTMLElement;
  const modalOverlay = document.getElementById('modal-overlay') as HTMLElement;
  nombre.value = p.nombre;
  desc.value = p.desc;
  precio.value = String(p.precio);
  stock.value = String(p.stock);
  cat.value = p.cat;
  emoji.value = p.emoji!;

  modalTitle.textContent = 'Editar Producto';
  modalOverlay.classList.add('open');
}

// ─── MODAL ───
function openModal() {
  editingId = null;

  const nombre = document.getElementById('form-nombre') as HTMLInputElement;
  const desc = document.getElementById('form-desc') as HTMLInputElement;
  const precio = document.getElementById('form-precio') as HTMLInputElement;
  const stock = document.getElementById('form-stock') as HTMLInputElement;
  const cat = document.getElementById('form-cat') as HTMLInputElement;
  const emoji = document.getElementById('form-emoji') as HTMLInputElement;

  const modalTitle = document.getElementById('modal-title') as HTMLElement;
  const modalOverlay = document.getElementById('modal-overlay') as HTMLElement;

  nombre.value = '';
  desc.value = '';
  precio.value = '';
  stock.value = '';
  cat.value = '';
  emoji.value = '';

  modalTitle.textContent = 'Agregar Producto';
  modalOverlay.classList.add('open');
}
function closeModal() {
  const modal_overlay = document.getElementById('modal-overlay');
  if(!modal_overlay) return;
  modal_overlay.classList.remove('open');
}

export function deleteProduct(id:number) {
  delProduct(id);
  renderTable();
  showToast('Producto eliminado.');
}

function saveProduct(): void {
  const nombre = (document.getElementById('form-nombre') as HTMLInputElement).value.trim();
  const precio = parseFloat((document.getElementById('form-precio') as HTMLInputElement).value);
  const stock = parseInt((document.getElementById('form-stock') as HTMLInputElement).value);
  const cat = (document.getElementById('form-cat') as HTMLInputElement).value;
  const desc = (document.getElementById('form-desc') as HTMLInputElement).value.trim();
  const result:Result = addProduct(nombre,precio,stock,cat,desc,editingId);
  if (!result.ok) {
  showToast(result.message);
} else {
  showToast(result.message);
}
  closeModal();
  renderTable();
}

// ─── PEDIDOS COMERCIANTE ───
function renderPedidos() {
  const estadoClass = {
    'Pendiente': 'estado-pendiente',
    'En proceso': 'estado-en-proceso',
    'Entregado': 'estado-entregado'
  };
  document.getElementById('pedidos-list')!.innerHTML = pedidos.map(p => {
    const total = p.items.reduce((s, i) => s + i.precio * i.qty, 0);
    return `
      <div class="pedido-card" onclick="openPedidoModal('${p.id}')">
        <div class="pedido-card-header">
          <span class="pedido-id">Pedido ${p.id}</span>
          <span class="estado-badge ${estadoClass[p.estado] || 'estado-pendiente'}">${p.estado}</span>
        </div>
        <div class="pedido-items">${p.items.map(i => `${i.nombre} x${i.qty}`).join(' · ')}</div>
        <div class="pedido-total">Total: Bs. ${total}</div>
      </div>`;
  }).join('');
}

function openPedidoModal(id:string) {
  const p = findPedido(id,pedidos);
  activePedidoId = id;
  if(!p) return;
  const total = p.items.reduce((s, i) => s + i.precio * i.qty, 0);
  document.getElementById('pm-id')!.textContent = `Pedido ${p.id}`;
  document.getElementById('pm-cliente')!.textContent = p.cliente;
  document.getElementById('pm-items')!.innerHTML = p.items.map(i => `
    <div class="pedido-detail-item">
      <span>${i.nombre} <span style="color:var(--muted)">x${i.qty}</span></span>
      <span style="font-weight:600">Bs. ${i.precio * i.qty}</span>
    </div>`).join('');
  document.getElementById('pm-total')!.textContent = `Bs. ${total}`;
  const sel = document.getElementById('pm-status');
  if(!sel) return;
  sel.innerHTML = ['Pendiente', 'En proceso', 'Entregado']
    .map(e => `<option ${e === p.estado ? 'selected' : ''}>${e}</option>`).join('');
  document.getElementById('pedido-modal-overlay')!.classList.add('open');
}

function closePedidoModal() {
  document.getElementById('pedido-modal-overlay')!.classList.remove('open');
}

function updatePedidoStatus() {
  const p = pedidos.find(x => x.id === activePedidoId);
  const pm_status = document.getElementById('pm-status') as HTMLInputElement;
  if(!pm_status) return;
  if (p) {
    p.estado = pm_status.value as EstadoPedido;
    renderPedidos();
  }
}


// ─── INIT ───
document.getElementById('modal-overlay')!.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('pedido-modal-overlay')!.addEventListener('click', function(e) {
  if (e.target === this) closePedidoModal();
});

renderCatalog(products);
(window as any).showPage = showPage;
(window as any).filterCat = filterCate;
(window as any).showDetail = showDetail;
(window as any).openModal = openModal;
(window as any).closeModal = closeModal;
(window as any).saveProduct = saveProduct;
(window as any).editProduct = editProduct;
(window as any).deleteProduct = deleteProduct;
(window as any).addProductToCart = addProductToCart;
(window as any).openPedidoModal = openPedidoModal;
(window as any).updatePedidoStatus = updatePedidoStatus;
(window as any).closePedidoModal = closePedidoModal;