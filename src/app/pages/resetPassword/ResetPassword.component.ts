// src/app/reset-password/reset-password.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms"; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { IResetPassword } from "../../interfaces";
import { validateHorizontalPosition } from "@angular/cdk/overlay";


@Component({
    selector: "app-reset-password",
    standalone: true,
    templateUrl: "./ResetPassword.component.html",
    styleUrls: ["./ResetPassword.component.scss"],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule
    ]
})
export class ResetPasswordComponent implements OnInit {

    resetPasswordForm!: FormGroup;
    token: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Usar queryParamMap para obtener el token de la URL (ej. /reset-password?token=XYZ)
        this.token = this.route.snapshot.queryParamMap.get('token');

        if (!this.token) {
            this.snackBar.open('Token de restablecimiento inválido o faltante.', 'Cerrar', {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
            this.router.navigate(['/forgot-password']);
            return;
        }

        this.resetPasswordForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]], //Minimo de caracteres
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator});
    }


    // Validador personalizado para asegurar que las contraseñas coincidan
    // Se define como una función estática o lambda para que 'this' no sea un problema si se usa fuera del constructor
    passwordMatchValidator (control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');

        // Si ambas contraseñas tienen valor y no coinciden, retorna el error 'mismatch'
        if (newPassword?.value !== confirmPassword?.value) {

            confirmPassword?.setErrors({mismatch: true});
            return { mismatch: true };
        } else {
            if(confirmPassword?.hasError('mismatch')){
                const errors = {... confirmPassword.errors};
                delete errors['mismatch'];

                confirmPassword.setErrors(Object.keys(errors).length === 0 ? null : errors)
            }
            return null;
        }
    };

    onSubmit(): void {
        if(this.resetPasswordForm.invalid){
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        const{
            newPassword,
            confirmPassword
        } = this.resetPasswordForm.value;

        if(this.token){
            this.authService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
                next: (response: any) =>{
                    this.snackBar.open(response.message || "Contraseña resetada con éxito", "Cerrar", {duration: 5000});
                    this.router.navigate(['/login']);
                },
                error: (error: any) =>{
                    console.log('Error al restablecer contraseña:', error);
                    this.snackBar.open(error.error?.message || 'Error al restablecer la contraseña. Intentalo dennuevo.', 'Cerrar', {duration: 5000});
                }
            });
        }
    }
}