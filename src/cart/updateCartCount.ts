import type { Cart } from "./Cart";

export function updateCartCount(cart:Cart[]) {
  const total = cart.reduce((acumulado, item) => acumulado + item.qty, 0);
  return total;
}
