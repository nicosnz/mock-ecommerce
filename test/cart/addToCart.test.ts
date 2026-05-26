  import { describe, expect, it } from 'vitest';
  import { Product } from '../../src/products/Product';
  import { Cart } from '../../src/cart/Cart';
  import { addToCart } from '../../src/cart/AddtoCart';

  describe('addToCart', () => {

    it('No debe agregar con stock no disponible', () => {

      const products: Product[] = [
        {
          id: 1,
          nombre: 'Laptop',
          desc: 'Laptop gamer',
          precio: 1200,
          stock: 0,
          cat: 'Tecnologia'
        }
      ];

      const cart: Cart[] = [];

      const result = addToCart(1, products, cart);

      expect(result).toBeNull();

      expect(products[0].stock).toBe(0);

    });

    it('Debe agregar correctamente cuando el stock es igual a 1', () => {

      const products: Product[] = [
        {
          id: 1,
          nombre: 'Mouse',
          desc: 'Mouse inalámbrico',
          precio: 25,
          stock: 1,
          cat: 'Tecnologia'
        }
      ];

      const cart: Cart[] = [];

      const result = addToCart(1, products, cart);

      expect(result).not.toBeNull();

      expect(result).toEqual([
        {
          producto: {
            id: 1,
            nombre: 'Mouse',
            desc: 'Mouse inalámbrico',
            precio: 25,
            stock: 0,
            cat: 'Tecnologia'
          },
          qty: 1
        }
      ]);

      expect(products[0].stock).toBe(0);

    });

  });