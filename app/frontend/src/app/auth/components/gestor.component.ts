import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css']
})
export class GestorComponent implements OnInit {
  gastos = [
    { descripcion: 'Supermercado', cantidad: 500 },
    { descripcion: 'Internet', cantidad: 300 }
  ];

  nuevoGasto = { descripcion: '', cantidad: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('miToken');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  agregarGasto(): void {
    if (this.nuevoGasto.descripcion && this.nuevoGasto.cantidad > 0) {
      this.gastos.push({ ...this.nuevoGasto });
      this.nuevoGasto = { descripcion: '', cantidad: 0 }; 
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('miToken');
    this.router.navigate(['/login']);
  }
}