import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css']
})
export class GestorComponent implements OnInit, OnDestroy {
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

      if (!token || this.tokenExpirado(token)) {
        this.expulsarPorExpiracion();
      } else {
        this.programarExpulsion(token);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
  }

  private tokenExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      return true;
    }
  }

  private programarExpulsion(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const tiempoRestante = (payload.exp * 1000) - Date.now();

      if (tiempoRestante > 0) {
        this.temporizador = setTimeout(() => {
          this.expulsarPorExpiracion();
        }, tiempoRestante);
      } else {
        this.expulsarPorExpiracion();
      }
    } catch (e) {
      this.expulsarPorExpiracion();
    }
  }

  private expulsarPorExpiracion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('miToken');
      alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
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