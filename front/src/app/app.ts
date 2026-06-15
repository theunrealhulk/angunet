import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotification } from './components/ui/toast-notification/toast-notification';
import { ThemeSwitcher } from './services/ui/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastNotification],
  template: `
    <router-outlet />
    <toast-notification />
  `,
  styles: [],
})
export class App {
  private readonly themeSwitcher = inject(ThemeSwitcher);
}
// test
 