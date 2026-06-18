import { Component, effect, input, output, signal } from '@angular/core';
import { InputField } from '../input/inputField';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from "../toast-notification/toast.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '../../../services/authentication';


@Component({
  selector: 'app-email-verificator',
  standalone: true,
  imports: [InputField, ReactiveFormsModule, MatButtonModule],
  templateUrl: `email-verificator.html`,
  styles: ``,
})
export class EmailVerificator {
  constructor(private readonly toast: ToastService, private readonly authService: Authentication) { }
  form = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    verificationCode: new FormControl('', { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)], nonNullable: true })
  })
  protected verified = output<string>()
  isDisabled = signal(false)
  isFieldDisabled = input.required<boolean>()
  isButtonDisabled = signal(true)
  protected isRequestingVerification = signal<boolean>(true)
  protected isWaitingVerification = signal<boolean>(false)
  protected update = (val: any) => {
    console.log(typeof val, val)
  }
  //button disabled when email input is invalid or 4digits visible and not valid
  //once code is sent, email input should be disabled and code input should be visible
  //while code is sent button should be disabled, untile the code input is valid

  protected sendCode = () => {
    const email = this.form.getRawValue().email
    this.authService.sendEmailVerificationCode(email).subscribe({
          next: (res) => {
            console.log(res)
            this.toast.show({ type: 'success', message: 'Verification code sent to your email! It will expire in 5 minutes.' })
            this.isDisabled.set(true)
            this.isWaitingVerification.set(true)
          },
          error: (res) => {
            this.toast.show({ type: 'error', message: `${res.status} Failed to send verification code : ${res.statusText}` })
          }
        })
        this.isRequestingVerification.set(false)
  }
  protected verifyCode = () => {
    const email = this.form.getRawValue().email
    const code = this.form.getRawValue().verificationCode
    if (this.form.valid){
      this.authService.verifyCode(code, email).subscribe({
        next: (res) => {
          console.log(res)
          this.toast.show({ type: 'success', message: 'Email verified successfully!' })
          this.verified.emit(email)
          this.isDisabled.set(true)
          //
        },
        error: (res) => {
          this.toast.show({ type: 'error', message: `${res.status} Failed to verify code : ${res.statusText}` })
        }
      })
    }

  }
  protected onSubmit = () => {

  }
}
