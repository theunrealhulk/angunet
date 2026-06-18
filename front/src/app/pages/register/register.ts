import { Component, computed, input, signal } from '@angular/core';
import { InputField } from '../../components/ui/input/inputField';
import { EmailVerificator } from "../../components/ui/email-verificator/email-verificator";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Authentication } from '../../services/authentication';
import { ToastService } from '../../components/ui/toast-notification/toast.service';
import { JsonPipe } from '@angular/common';
import { passwordMatchValidator } from '../../validators/passwordMatchValidator';
import { MatIcon } from "@angular/material/icon";


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputField, EmailVerificator, ReactiveFormsModule, RouterLink, MatButtonModule, MatProgressSpinner, JsonPipe, MatIcon],
  templateUrl: `register.html`,
  styles: ``,
})
export class Register {
  constructor(private authService: Authentication, private toastService: ToastService, private router: Router) { }
  protected canShowRegisterForm = signal<boolean>(false)
  protected currentFields = computed(() => {
    if (this.canShowRegisterForm()) {
      return { ...this.form.getRawValue() }
    }
    return []
  })
  form = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    fullName: new FormControl('', { validators: [Validators.minLength(3), Validators.required], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required, Validators.pattern(passwordRegex)], nonNullable: true }),
    confirm_password: new FormControl('', { validators: [passwordMatchValidator], nonNullable: true })
  })
  confirmEmail(email: string) {
    this.form.get('email')?.setValue(email)
    this.canShowRegisterForm.set(true)
  }
  onSubmit() {
    const { email, fullName, password } = this.form.getRawValue();
    console.log(this.form)
    if (this.form.valid) {
      this.authService.register(email, fullName, password).subscribe({
        next: (res) => {
          console.log(res)
          this.toastService.show({ type: 'success', message: 'Registration successful!' })
          //redirect to home page
          this.router.navigate(['/']);
        },
        error: (res) => {
          console.log(res)
          this.toastService.show({ type: 'error', message: 'Registration failed!' })
        }
      })
    }
  }

}
