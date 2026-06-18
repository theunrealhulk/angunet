import { Component } from '@angular/core';
import { InputField } from "../../components/ui/input/inputField";
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { ToastService } from '../../components/ui/toast-notification/toast.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  imports: [InputField, MatAnchor, RouterLink, ReactiveFormsModule, MatIcon],
  templateUrl: `login.html`,
  styles: `
`,
})
export class Login {
  constructor(private toast: ToastService, private authservice: Authentication, private router: Router) { }
  form = new FormGroup({
    email: new FormControl('', { validators: [Validators.email, Validators.required], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], nonNullable: true })
  })
  protected onSubmit = () => {
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.authservice.login(email, password).subscribe({
        next: (res) => {
          this.toast.show({ type: 'success', message: 'WIP successfully authenticated!' })
          const token = res.data
          //redirect to home page
          /**
           * {
    "success": true,
    "message": "Login successful",
    "statusCode": 200,
    "data": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjaGFmaWFheUB5b3BtYWlsLmNvbSIsImV4cCI6MTc4MTc5MTAxMSwiaXNzIjoiSk9CLUgtSSIsImF1ZCI6IkpPQi1ILUEifQ.9HCSkt17uLe9ejyl0sRxY9CmbqfmSQsI0BVmWXs39X-FRbOgjucNavO_65misB17H06-yCBdwwha4iM4Vsj2WQ"
}
           */
          this.router.navigate(['/dashboard']);
        },
        error: (res) => {
          this.toast.show({ type: 'error', message: `${res.status} Login Failed : ${res.statusText}` })
        }
      })
    }
    //this.toast.show({ type: 'info', message: 'Work in progress...' });
  }
}
