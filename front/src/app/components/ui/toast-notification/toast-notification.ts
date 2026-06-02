import { Component, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ToastService } from './toast.service';
import type { Toast } from './toast.service';
import type { ToastPosition, ToastType } from '../../../interfaces/ui/types';

const TYPE_CLASSES: Record<ToastType, string> = {
  info: 'bg-sky-600 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-red-600 text-white',
  success: 'bg-emerald-600 text-white',
};

const ICONS: Record<ToastType, string> = {
  info: 'info',
  warning: 'warning',
  error: 'close',
  success: 'check_circle',
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'upper-left': 'top-4 left-4',
  'upper-center': 'top-4 left-1/2 -translate-x-1/2',
  'upper-right': 'top-4 right-4',
  'lower-left': 'bottom-4 left-4',
  'lower-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'lower-right': 'bottom-4 right-4',
};

const POSITIONS: ToastPosition[] = [
  'upper-left',
  'upper-center',
  'upper-right',
  'lower-left',
  'lower-center',
  'lower-right',
];

@Component({
  selector: 'toast-notification',
  imports: [MatIcon],
  templateUrl: 'toast-notification.html',
  styles: `
    .toast-item {
      animation: t-fade-in 200ms ease-out both;
    }
    @keyframes t-fade-in {
      from { opacity: 0; translate: 0 -0.75rem; }
    }
  `,
})
export class ToastNotification {
  readonly positions = POSITIONS;

  protected readonly grouped = computed(() => {
    const groups: Record<ToastPosition, Toast[]> = {
      'upper-left': [], 'upper-center': [], 'upper-right': [],
      'lower-left': [], 'lower-center': [], 'lower-right': [],
    };
    for (const t of this.service.toasts()) {
      groups[t.position].push(t);
    }
    return groups;
  });

  constructor(private readonly service: ToastService) {}

  protected positionClass(pos: ToastPosition): string {
    return POSITION_CLASSES[pos];
  }

  protected typeClass(type: ToastType): string {
    return TYPE_CLASSES[type];
  }

  protected icon(type: ToastType): string {
    return ICONS[type];
  }

  protected dismiss(id: string): void {
    this.service.dismiss(id);
  }
}
