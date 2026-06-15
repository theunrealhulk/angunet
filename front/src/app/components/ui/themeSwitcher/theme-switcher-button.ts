import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeSwitcher } from '../../../services/ui/theme-switcher';
import { Theme } from '../../../../interfaces/ui';

@Component({
  selector: 'theme-switcher-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: 'theme-switcher-button.html',
  styles: '',
})
export class ThemeSwitcherButton {
  protected themeSwitcher = inject(ThemeSwitcher);
  protected Theme = Theme;
}
