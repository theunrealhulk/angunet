import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotification } from './components/ui/toast-notification/toast-notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastNotification],
  template: `
    <router-outlet />
    <toast-notification />
  `,
  styles: [],
})
export class App {}
