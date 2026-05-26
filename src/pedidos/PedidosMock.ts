import type { Pedido } from "./Pedido";

export let pedidos:Pedido[] = [
  { id:'#001', cliente:'María González', items:[{nombre:'Salteñas artesanales', qty:4, precio:12},{nombre:'Jugo de majo natural', qty:2, precio:18}], estado:'Pendiente' },
  { id:'#002', cliente:'Juan Flores', items:[{nombre:'Singani artesanal 500ml', qty:1, precio:85}], estado:'En proceso' },
  { id:'#003', cliente:'Elena Paz', items:[{nombre:'Blusa tejida a mano', qty:2, precio:150}], estado:'Entregado' },
];

export function findPedido(id:string,pedidos:Pedido[]){
   return pedidos.find(x => x.id === id) || null;

}