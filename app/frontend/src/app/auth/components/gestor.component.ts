import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css']
})
export class GestorComponent implements OnInit, OnDestroy {
  // Ajusta el tiempo de inactividad aquí ('15s', '30s', '1m', '5m', '1h')
  readonly TIEMPO_INACTIVIDAD = '15s';

  usuario = { nombre: 'Usuario', email: 'usuario@email.com' };
  resumen = { ingresos: 0, gastos: 0, balance: 0 };
  movimientos: any[] = [];

  private temporizador: any;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('miToken');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
      this.reiniciarTemporizador();
    }
  }

  ngOnDestroy(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
  }

  // Reinicia la cuenta atrás con cada movimiento, clic, tecla o scroll
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:scroll')
  reiniciarTemporizador(): void {
    if (!this.isBrowser) return;

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    const ms = this.convertirAMilisegundos(this.TIEMPO_INACTIVIDAD);
    this.temporizador = setTimeout(() => {
      this.expulsarPorInactividad();
    }, ms);
  }

  private convertirAMilisegundos(tiempo: string): number {
    const unidad = tiempo.slice(-1);
    const valor = parseInt(tiempo.slice(0, -1), 10);

    if (unidad === 's') return valor * 1000;
    if (unidad === 'm') return valor * 60 * 1000;
    if (unidad === 'h') return valor * 60 * 60 * 1000;
    return valor * 1000;
  }

  private expulsarPorInactividad(): void {
    if (this.isBrowser) {
      localStorage.removeItem('miToken');
      alert('⚠️ Su sesión ha expirado por inactividad.');
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('miToken');
      this.router.navigate(['/login']);
    }
  }
}