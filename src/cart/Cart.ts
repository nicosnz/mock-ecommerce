import type { Product } from "../products/Product";

export interface Cart{
    producto:Product;
    qty:number;
}