import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css']
})
export class GestorComponent implements OnInit {
  usuario = { nombre: 'Usuario', email: 'usuario@email.com' };
  
  resumen = { ingresos: 0, gastos: 0, balance: 0 };
  movimientos: any[] = []; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('miToken');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('miToken');
    this.router.navigate(['/login']);
  }
}