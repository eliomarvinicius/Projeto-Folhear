import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'autores' })
export class AutoresPipe implements PipeTransform {
  transform(nomes: string[] | null | undefined, limite = 3): string {
    const vistos = new Map<string, string>();
    for (const nome of nomes ?? []) {
      const limpo = nome.trim();
      if (limpo && !vistos.has(limpo.toLowerCase())) {
        vistos.set(limpo.toLowerCase(), limpo);
      }
    }
    const unicos = [...vistos.values()];
    if (unicos.length === 0) {
      return 'Autor desconhecido';
    }
    if (unicos.length === 1) {
      return unicos[0];
    }
    if (unicos.length > limite) {
      const resto = unicos.length - limite;
      return `${unicos.slice(0, limite).join(', ')} e mais ${resto}`;
    }
    return `${unicos.slice(0, -1).join(', ')} e ${unicos[unicos.length - 1]}`;
  }
}
