import type { Product } from "./Product";

export type Result = {
  ok:boolean;
  message:string
}
export let products:Product[] = [
  { id:1, nombre:'Salteñas artesanales', desc:'Elaboradas con masa crujiente y relleno de carne jugosa. Receta familiar de 3 generaciones.', precio:12, stock:30, cat:'Alimentos', emoji:'🥟', opinions:[{autor:'Ana M.', estrellas:5, texto:'Las mejores salteñas que he comido!'},{autor:'Carlos R.', estrellas:4, texto:'Muy buenas, el relleno es delicioso.'}] },
  { id:2, nombre:'Tucumanas de queso', desc:'Crujientes por fuera, con relleno de queso fundido y especias.', precio:8, stock:15, cat:'Alimentos', emoji:'🥠', opinions:[{autor:'Sofía T.', estrellas:5, texto:'Adicta a estas tucumanas!'}] },
  { id:3, nombre:'Singani artesanal 500ml', desc:'Singani puro de uva moscatel, destilado en los valles bolivianos.', precio:85, stock:20, cat:'Bebidas', emoji:'🍾', opinions:[{autor:'Pedro L.', estrellas:5, texto:'Excelente calidad.'}] },
  { id:4, nombre:'Jugo de majo natural', desc:'Jugo fresco de majo, sin conservantes. Botella de 1 litro.', precio:18, stock:40, cat:'Bebidas', emoji:'🧃', opinions:[] },
  { id:5, nombre:'Blusa tejida a mano', desc:'Tejida por artesanas cruceñas, 100% algodón, tallas S-XL.', precio:150, stock:8, cat:'Ropa', emoji:'👘', opinions:[{autor:'Luciana B.', estrellas:4, texto:'Hermosa, el tejido es increíble.'}] },
  { id:6, nombre:'Lámpara de bambú', desc:'Diseño rústico-moderno, hecho con bambú local. Ideal para decoración.', precio:220, stock:5, cat:'Hogar', emoji:'🪔', opinions:[{autor:'Roberto V.', estrellas:5, texto:'Perfecta para mi sala, muy buen acabado.'}] },
];

export function delProduct(id:number) {
  products = products.filter(p => p.id !== id);
  
}

export function addProduct(
  nombre: string,
  precio: number,
  stock: number,
  cat: string,
  desc: string,
  editingId: number | null
):Result {
  console.log(precio,stock);
  
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
export function filterCat(cat:string,products:Product[]) {
  const filtered = cat === 'todos' ? products : products.filter(p => p.cat === cat);
  return filtered;
}