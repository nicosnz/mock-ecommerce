import type { Opinion } from "../opinions/Opinion";

export interface Product{
    id:number;
    nombre:string;
    desc:string;
    precio:number;
    stock:number
    cat:string;
    emoji?:string;
    opinions?:Opinion[]
}