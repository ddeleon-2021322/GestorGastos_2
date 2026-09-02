import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  nuevoIngreso = { titulo: '', monto: null };
  listaIngresos: any[] = [];
  totalIngresos: number = 0;
  mensaje: string = '';
  cargando: boolean = false;

  private apiUrl = 'http://localhost:3000/api/ingresos';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerIngresos();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('miToken') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerIngresos(): void {
    this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.totalIngresos = Number(res.total) || 0;
        this.listaIngresos = res.movimientos || [];
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  guardarIngreso(): void {
    if (!this.nuevoIngreso.titulo || !this.nuevoIngreso.monto) return;

    this.cargando = true;
    this.http.post(this.apiUrl, this.nuevoIngreso, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensaje = 'Ingreso registrado con éxito';
        this.nuevoIngreso = { titulo: '', monto: null };
        this.cargando = false;
        this.obtenerIngresos();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: () => {
        this.mensaje = 'Error al registrar el ingreso';
        this.cargando = false;
      }
    });
  }
}