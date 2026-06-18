import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSwitcherButton } from '../../components/ui/themeSwitcher/theme-switcher-button';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, ThemeSwitcherButton],
  templateUrl: 'auth-layout.html',
  styles: '',
})
export class AuthLayout {}
