import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  usuario = { nombre: 'Usuario', email: 'usuario@email.com' };
  fechaHoy: string = '';
  
  totalIngresos: number = 0;
  transacciones: any[] = [];
  fuentes: { nombre: string; monto: number; porcentaje: number; color: string }[] = [];
  tendencia: { mes: string; fecha: string; valor: string; altura: string }[] = [];
  fondoDonut: string = 'conic-gradient(#e5e7eb 0% 100%)';

  // Paleta de colores para las diferentes categorías
  private paletaColores = ['#106b4e', '#c5a365', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

  // Control del modal
  mostrarModal: boolean = false;
  nuevoIngreso = { titulo: '', monto: null };
  guardando: boolean = false;

  private isBrowser: boolean;
  private apiUrl = 'http://localhost:3000/api/ingresos';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaHoy = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;

    if (this.isBrowser) {
      const token = localStorage.getItem('miToken');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
      this.cargarDatos();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('miToken') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  cargarDatos(): void {
    this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.totalIngresos = Number(data.total) || 0;
        this.transacciones = data.transacciones || [];
        this.procesarFuentes();
        this.procesarTendencia();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('miToken');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private procesarFuentes(): void {
    if (!this.transacciones || this.transacciones.length === 0 || !this.totalIngresos) {
      this.fuentes = [];
      this.fondoDonut = 'conic-gradient(#e5e7eb 0% 100%)';
      return;
    }

    const mapa: { [key: string]: number } = {};
    for (const t of this.transacciones) {
      const titulo = t.titulo || 'Otros';
      mapa[titulo] = (mapa[titulo] || 0) + Number(t.monto);
    }

    // Calcula porcentajes y asigna un color único a cada barra
    this.fuentes = Object.keys(mapa)
      .map((nombre, index) => ({
        nombre,
        monto: mapa[nombre],
        porcentaje: Math.round((mapa[nombre] / this.totalIngresos) * 100),
        color: this.paletaColores[index % this.paletaColores.length]
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 3);

    // Genera el gradiente cónico para el gráfico de pastel
    let acumulado = 0;
    const partes: string[] = [];

    this.fuentes.forEach((f) => {
      const inicio = acumulado;
      acumulado += f.porcentaje;
      partes.push(`${f.color} ${inicio}% ${acumulado}%`);
    });

    if (acumulado < 100 && this.fuentes.length > 0) {
      partes.push(`${this.fuentes[this.fuentes.length - 1].color} ${acumulado}% 100%`);
    }

    this.fondoDonut = `conic-gradient(${partes.join(', ')})`;
  }

  private procesarTendencia(): void {
    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const resultado = [];
    const ahora = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const mesIndex = d.getMonth();
      const anio = d.getFullYear();

      const totalMes = this.transacciones
        .filter((t) => {
          const f = new Date(t.fecha);
          return f.getMonth() === mesIndex && f.getFullYear() === anio;
        })
        .reduce((acc, curr) => acc + Number(curr.monto), 0);

      resultado.push({
        mes: mesesNombres[mesIndex],
        fecha: `01/${mesIndex + 1}/${anio}`,
        montoNum: totalMes,
        valor: totalMes > 999 ? `Q ${(totalMes / 1000).toFixed(1)}k` : `Q ${totalMes}`,
        altura: '0%'
      });
    }

    const maxMonto = Math.max(...resultado.map((r) => r.montoNum), 1);
    this.tendencia = resultado.map((r) => ({
      ...r,
      altura: `${Math.max(12, Math.round((r.montoNum / maxMonto) * 95))}%`
    }));
  }

  abrirModal(): void {
    this.nuevoIngreso = { titulo: '', monto: null };
    this.guardando = false;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.guardando = false;
    this.cdr.detectChanges();
  }

  registrarIngreso(): void {
    if (!this.nuevoIngreso.titulo || !this.nuevoIngreso.monto) return;

    this.guardando = true;
    this.http.post(this.apiUrl, this.nuevoIngreso, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        this.guardando = false;
        this.cdr.detectChanges();
        console.error('Error al guardar:', err);
        alert('Error al registrar el ingreso.');
      }
    });
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('miToken');
      this.router.navigate(['/login']);
    }
  }
}