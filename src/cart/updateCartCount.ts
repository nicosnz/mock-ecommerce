import type { Cart } from "./Cart";

export function updateCartCount(cart:Cart[]) {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  return total;
}
