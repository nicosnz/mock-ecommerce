import { updateCartCount } from "../cart/AddtoCart";
import type { Cart } from "../cart/Cart";
import { showToast } from "../shared/Toast";
import { pedidos } from "./PedidosMock";

// export function confirmPedido(cart:Cart[]) {
//   if (!cart.length) return;
//   const newPedido = {
//     id: '#' + String(pedidos.length + 1).padStart(3, '0'),
//     cliente: 'Cliente Online',
//     items: cart.map(i => ({ nombre: i.producto.nombre, qty: i.qty, precio: i.producto.precio })),
//     estado: 'Pendiente'
//   };
//   pedidos.unshift(newPedido);
//   cart = [];
//   updateCartCount(cart);
//   showToast('¡Pedido confirmado con éxito! 🎉');
//   renderCart();
// }