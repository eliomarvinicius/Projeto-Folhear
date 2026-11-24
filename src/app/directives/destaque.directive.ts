import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appDestaque]' })
export class DestaqueDirective {
  @HostBinding('class.destaque') ativo = false;

  @HostListener('pointerenter') entrar(): void {
    this.ativo = true;
  }

  @HostListener('pointerleave') sair(): void {
    this.ativo = false;
  }
}
