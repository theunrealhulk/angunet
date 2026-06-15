import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeSwitcherButton } from '../ui/themeSwitcher/theme-switcher-button';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, ThemeSwitcherButton],
  templateUrl: `header.html`,
  styles: `
   .example-spacer {
      flex: 1 1 auto;
    }`,
})
export class Header {}
