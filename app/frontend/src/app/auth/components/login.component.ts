import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';

constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('miToken', response.token);
          
          this.router.navigate(['/gestor']); 
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error.message || 'Credenciales incorrectas';
      }
    });
  }
}