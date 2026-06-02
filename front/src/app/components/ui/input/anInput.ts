import { Component,input } from '@angular/core';
import { MatFormField, MatFormFieldAppearance, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

interface FieldInput{
  type:"text"|"email"|"password"|"number",
  name:string,
  label:string,
  icon?:string
}
@Component({
  selector: 'app-input',
  imports: [MatFormField, MatInput, MatLabel, MatIcon],
  template: `
  <mat-form-field appearance="outline" class="w-full">
      <mat-label class="flex items-center gap-2">
          @if(data().icon){
            <mat-icon>{{data().icon}}</mat-icon>
          }
          <span>{{data().label}}</span>
      </mat-label>
      <input matInput [type]="data().type" [name]="data().name">
  </mat-form-field>
  `,
  styles: ``,
})
export class anInput {
  readonly data= input.required<FieldInput>()
}
