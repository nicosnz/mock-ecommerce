import type { Result } from '../shared/Result'

export function addProduct(
  nombre: string,
  precio: number,
  stock: number,
  cat: string
): Result {
  if (!nombre || !cat) {
    return { ok: false, message: '⚠️ Por favor completá los campos obligatorios.' }
  }
  if (!precio || !stock) {
    return { ok: false, message: '⚠️ Por favor dar numeros validos para precio o stock.' }
  }
  if (precio < 0 || stock < 0) {
    return { ok: false, message: '⚠️ Por favor no introducir numeros negativos.' }
  }
  return { ok: true, message: '' }
}
