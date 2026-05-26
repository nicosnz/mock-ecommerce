import { describe, expect, it } from 'vitest';
import { addProduct } from '../../src/products/addProduct';
import { products } from '../../src/products/ProductsMock';

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
      editingId,
      products
    );

    expect(result).toEqual({
      ok: true,
      message: 'Producto agregado con éxito ✓'
    });

  });

  

  it('No debe agregar cuando el precio o stock son igual a 0', () => {

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
      editingId,
      products
    );

    expect(result).toEqual({
      ok: false,
      message: '⚠️ Por favor dar numeros validos para precio o stock.'
    });

  });
  it('No debe agregar cuando el precio o stock son menor a 0', () => {

    const nombre = 'Teclado';
    const precio = -12;
    const stock = -23;
    const cat = 'Tecnologia';
    const desc = 'Teclado mecanico';
    const editingId = null;

    const result = addProduct(
      nombre,
      precio,
      stock,
      cat,
      desc,
      editingId,
      products
    );

    expect(result).toEqual({
      ok: false,
      message: '⚠️ Por favor no introducir numeros negativos.'
    });

  });

});