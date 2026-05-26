# Pruebas Unitarias

## Cart

### Historia de Usuario
```text
HU-04

Orden de prioridad: 4 / 20
Tipo de prioridad: Alta 

Historia:
Como cliente, quiero agregar productos a un pedido desde la interfaz, para organizar lo que deseo comprar antes de confirmarlo

Criterios de aceptación:
- Dado que el cliente está visualizando el detalle de un producto, cuando selecciona la opción “Agregar al pedido”, entonces el sistema debe reflejar visualmente que el producto fue añadido.

- Dado que el producto fue agregado al pedido, cuando el cliente revisa su pedido, entonces debe poder ver el producto listado con su cantidad correspondiente.

- Dado que el cliente intenta agregar un producto sin stock disponible, cuando selecciona “Agregar al pedido”, entonces el sistema rechaza la acción y muestra un mensaje de error. 

- Dado que el producto tiene stock igual a 1, cuando el cliente lo agrega al pedido, entonces el sistema registra correctamente el producto sin exceder el stock disponible. 
Estimación: 4 h
```
### Código
```typescript
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
```

## Product

### Historia de Usuario

```text
HU-01

Orden de prioridad: 1 / 20
Tipo de prioridad: Alta

Historia:
Como comerciante, quiero registrar y mostrar mis productos en la plataforma para dar a conocer mi oferta y facilitar que los clientes realicen pedidos.

Criterios de aceptación:

- Dado que el comerciante ha iniciado sesión correctamente, cuando accede a la sección “Gestión de Productos”, y selecciona la opción “Agregar Productos”, entonces el sistema debe mostrar un formulario con campos claramente identificados para nombre, descripción,categoria, stock,precio y emoji.

- Dado que el comerciante completa correctamente todos los campos obligatorios del producto, cuando selecciona “Guardar”, entonces el sistema registra el producto exitosamente.

- Dado que el comerciante intenta guardar un producto, cuando deja campos obligatorios vacíos, entonces el sistema muestra mensajes de error específicos y no registra el producto. 

- Dado que el comerciante ingresa valores mínimos invalidos (por ejemplo stock = 0 o precio = 0), cuando guarda el producto, entonces el sistema debe denegar el registro
Estimación: +1 día  

```

### Código

```typescript
import { describe, expect, it } from 'vitest';
import { addProduct } from '../../src/products/ProductsMock';

describe('addProduct', () => {

  it('Debe registrar exitosamente cuando los campos requeridos son enviados', () => {

    const nombre = 'Laptop';
    const precio = 2500;
    const stock = 10;
    const cat = 'Tecnologia';
    const desc = 'Laptop gamer';
    const editingId = null;

    const result = addProduct(
      nombre,
      precio,
      stock,
      cat,
      desc,
      editingId
    );

    expect(result).toEqual({
      ok: true,
      message: 'Producto agregado con éxito ✓'
    });

  });

  

  it('No debe agregar cuando el precio o stock son menor o igual a 0', () => {

    const nombre = 'Teclado';
    const precio = 0;
    const stock = 0;
    const cat = 'Tecnologia';
    const desc = 'Teclado mecanico';
    const editingId = null;

    const result = addProduct(
      nombre,
      precio,
      stock,
      cat,
      desc,
      editingId
    );

    expect(result).toEqual({
      ok: false,
      message: '⚠️ Por favor dar numeros validos para precio o stock.'
    });

  });

});

```