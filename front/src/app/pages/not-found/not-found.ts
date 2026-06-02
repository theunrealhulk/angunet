import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatIcon],
  template: `
    <div class="flex flex-col items-center justify-center h-screen gap-4">
      <mat-icon class="scale-[3] text-on-surface-variant">explore_off</mat-icon>
      <h1 class="text-4xl font-black">404</h1>
      <p class="text-on-surface-variant">Destination unknown…</p>
      <a routerLink="/" class="mt-4 rounded-full bg-primary px-6 py-2 text-on-primary font-medium">Go home</a>
    </div>
  `,
  styles: ``,
})
export class NotFound {}
