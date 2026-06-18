import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirm_password');

  // If controls aren't ready, or confirm_password is empty, skip validation
  if (!password || !confirmPassword || !confirmPassword.value) {
    return null;
  }

  // Set error on the group if they do not match
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};