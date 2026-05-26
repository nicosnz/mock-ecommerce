
type Items = {
    nombre:string;
    qty:number;
    precio:number;
}
export type EstadoPedido = 'Pendiente' | 'En proceso' | 'Entregado';
export interface Pedido{
    id:string;
    cliente:string;
    items:Items[];
    estado:EstadoPedido;
}