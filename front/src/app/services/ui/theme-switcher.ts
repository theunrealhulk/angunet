import { Injectable, signal } from '@angular/core';
import { Theme } from '../../../interfaces/ui';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitcher {
  theme = signal<Theme>(Theme.light);

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      const t = saved === 'dark' ? Theme.dark : Theme.light;
      this.theme.set(t);
      this.applyTheme(t);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const t = prefersDark ? Theme.dark : Theme.light;
      this.theme.set(t);
      this.applyTheme(t);
    }
  }

  toggle(): void {
    const newTheme = this.theme() === Theme.light ? Theme.dark : Theme.light;
    this.theme.set(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme === Theme.light ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === Theme.dark);
  }
}
