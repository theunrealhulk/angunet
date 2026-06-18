import { Component, signal } from '@angular/core';
import { EmailVerificator } from "../../components/ui/email-verificator/email-verificator";
import { RouterLink } from '@angular/router';
import { InputField } from '../../components/ui/input/inputField';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [EmailVerificator, ReactiveFormsModule, RouterLink, InputField, MatButtonModule],
  templateUrl: `reset-password.html`,
  styles: ``,
})
export class ResetPassword {
  constructor(private authService: Authentication) { }
  protected isNewPasswordFieldsVisible = signal<boolean>(false)
  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  protected showNewPasswordFileds = (response: boolean) => {
    if (response) {
      this.isNewPasswordFieldsVisible.set(!this.isNewPasswordFieldsVisible())
    }
  }
  protected onSubmit = () => {

  }
}

