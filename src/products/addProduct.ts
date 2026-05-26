import type { Result } from '../shared/Result';
import type { Product } from './Product';
export function addProduct(
  nombre: string,
  precio: number,
  stock: number,
  cat: string,
  desc: string,
  editingId: number | null,
  products:Product[]
):Result {
  
  if (!nombre || !cat) {
    return {
      ok: false,
      message: '⚠️ Por favor completá los campos obligatorios.'
    };
  }
  if(!precio || !stock){
    return {
      ok:false,
      message: '⚠️ Por favor dar numeros validos para precio o stock.'
    }
  }

  if (precio < 0 || stock < 0) {
    return {
      ok: false,
      message: '⚠️ Por favor no introducir numeros negativos.'
    };
  }

  const product = {
    id: editingId || Date.now(),
    nombre,
    desc: desc || 'Sin descripción.',
    precio,
    stock,
    cat,
    emoji: '📦',
  };

  if (editingId) {
    products = products.map(p =>
      p.id === editingId ? product : p
    );

    return {
      ok: true,
      message: 'Producto actualizado'
    };
  }

  products.push(product);

  return {
    ok: true,
    message: "Producto agregado con éxito ✓"
  };
}