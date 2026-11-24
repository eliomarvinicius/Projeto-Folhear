import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'autores' })
export class AutoresPipe implements PipeTransform {
  transform(nomes: string[] | null | undefined): string {
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
    return `${unicos.slice(0, -1).join(', ')} e ${unicos[unicos.length - 1]}`;
  }
}
