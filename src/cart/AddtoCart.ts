import type { Product } from "../products/Product";
import type { Cart } from "./Cart";

export function addToCart(
  id: number,
  products: Product[],
  cart: Cart[]
): Cart[] | null {

  const p = products.find(x => x.id === id);

  if (!p) return null;

  if (p.stock <= 0) {
    return null;
  }

  p.stock--;

  const existing = cart.find(
    x => x.producto.id === id
  );

  if (existing) {

    return cart.map(item => {

      if (item.producto.id === id) {
        return {
          ...item,
          qty: item.qty + 1
        };
      }

      return item;
    });
  }

  return [
    ...cart,
    {
      producto: { ...p },
      qty: 1
    }
  ];
}

export function updateCartCount(cart:Cart[]) {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  return total;
}

