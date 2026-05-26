import type { Product } from "./Product";

export function filterCat(cat:string,products:Product[]) {
  const filtered = cat === 'todos' ? products : products.filter(p => p.cat === cat);
  return filtered;
}