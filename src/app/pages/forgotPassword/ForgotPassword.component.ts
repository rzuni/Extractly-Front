// src/app/forgot-password/forgot-password.component.ts
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { RouterLink } from "@angular/router";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Añadido para matInput
import { MatButtonModule } from '@angular/material/button'; // Añadido para mat-raised-button
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './ForgotPassword.component.html',
    styleUrls: ['./ForgotPassword.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule, // Asegúrate de importar MatInputModule
        MatButtonModule // Asegúrate de importar MatButtonModule
    ]
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup;
    email: any;
    isSubmitted = false;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ){
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.valid) {
            const email = this.forgotPasswordForm.get('email')?.value;
            // El AuthService ya está tipado para construir el IForgotPasswordRequest
            this.authService.forgotPassword(email).subscribe({
                next: (response) => {
                    this.snackBar.open(response.message || 'Si tu correo está registrado, recibirás un enlace.', 'Cerrar', {
                        duration: 5000,
                        panelClass: ['success-snackbar']
                    });
                    this.forgotPasswordForm.reset(); // Limpia el formulario
                },
                error: (error) => {
                    this.snackBar.open(error.error?.message || 'Error al enviar el correo. Inténtalo de nuevo.', 'Cerrar', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
          if (this.forgotPasswordForm.valid) {
    this.isLoading = true;
    this.email = this.forgotPasswordForm.value.email;

    setTimeout(() => {
      this.isLoading = false;
      this.isSubmitted = true;
    }, 2000);
  }
    }

    
resetForm() {
  this.forgotPasswordForm.reset();
  this.isSubmitted = false;
}
}