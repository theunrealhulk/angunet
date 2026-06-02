import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeSwitcher } from '../../services/ui/theme-switcher';
import { Theme } from '../../../interfaces/ui';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: `header.html`,
  styles: `
   .example-spacer {
      flex: 1 1 auto;
    }`,
})
export class Header {
  protected themeSwitcher = inject(ThemeSwitcher);
  protected Theme = Theme;
}
