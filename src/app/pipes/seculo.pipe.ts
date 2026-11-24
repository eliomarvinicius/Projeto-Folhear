import { Pipe, PipeTransform } from '@angular/core';

const ROMANOS: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

@Pipe({ name: 'seculo' })
export class SeculoPipe implements PipeTransform {
  transform(ano: number | null | undefined): string {
    if (!ano || ano < 1) {
      return '';
    }
    return `Século ${paraRomano(Math.ceil(ano / 100))}`;
  }
}

function paraRomano(numero: number): string {
  let resto = numero;
  let texto = '';
  for (const [valor, simbolo] of ROMANOS) {
    while (resto >= valor) {
      texto += simbolo;
      resto -= valor;
    }
  }
  return texto;
}
