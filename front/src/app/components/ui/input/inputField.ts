import { Component, input, output, signal } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface FieldInput {
  type: "text" | "email" | "date" | "password" | "number",
  name: string,
  label: string,
  icon?: string,
  isDisabled?: boolean
}
@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [MatFormField, MatInput, MatLabel, MatIcon, FormsModule, MatSuffix, ReactiveFormsModule, MatError],
  template: `
  <mat-form-field appearance="outline" class="w-full mb-1">
      <mat-label class="inline-flex items-center gap-2">
          @if(data().icon){
            <mat-icon>{{data().icon}}</mat-icon>
          }
          <span>{{data().label}}</span>
      </mat-label>
      <input matInput 
      [formControl]="control()"
      [type]="data().type==='password' && isContentVisible() ? 'text' : data().type" 
      [name]="data().name" 
      (input)="changed($any($event.target).value)" />
      @if(data().type==='password'){
        <mat-icon matSuffix class="cursor-pointer" (click)="toggleVisibility($event)">
          {{isContentVisible()?'visibility':'visibility_off'}}
        </mat-icon>
      }

      @if (control().invalid && control().touched) {
          <mat-error >
              @if (control().hasError('required')) {
                  <span>The {{ data().label }} field is required.</span>
              }
              @if (control().hasError('email')) {
                  <span>Please enter a valid email address.</span>
              }
       
              @if(control().hasError('pattern')) {
                  <span>Password must contain at least 8 charachters, include mixed-case letters,digits, symbols.</span>
              }
          </mat-error>
      }
    </mat-form-field>
  `,
  styles: ``,
})
export class InputField {
  control = input.required<FormControl>();
  data = input.required<FieldInput>()
  protected isContentVisible = signal(false)
  protected change = output<string>()
  protected changed = (val: string) => {
    this.change.emit(val)
  }
  protected toggleVisibility = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (this.data().type === 'password') {
      this.isContentVisible.update(visible => !visible);
    }
  }
}
