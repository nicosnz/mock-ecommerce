import { describe, expect, it } from 'vitest';
import { addProduct } from '../../src/products/addProduct';

describe('addProduct', () => {

  

  it('No debe agregar cuando el precio o stock son igual a 0', () => {
    const result = addProduct('Teclado', 0, 0, 'Tecnologia');
    expect(result).toEqual({
      ok: false,
      message: '⚠️ Por favor dar numeros validos para precio o stock.'
    });
  });

  it('No debe agregar cuando el precio o stock son menor a 0', () => {
    const result = addProduct('Teclado', -12, -23, 'Tecnologia');
    expect(result).toEqual({
      ok: false,
      message: '⚠️ Por favor no introducir numeros negativos.'
    });
  });

  it('No debe agregar cuando faltan campos obligatorios', () => {
    const result = addProduct('', 100, 5, '');
    expect(result).toEqual({
      ok: false,
      message: '⚠️ Por favor completá los campos obligatorios.'
    });
  });

});
