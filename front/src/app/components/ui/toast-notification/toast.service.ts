import { Injectable, signal } from '@angular/core';
import type { ToastConfig, ToastPosition, ToastType } from '../../../interfaces/ui/types';

export interface Toast extends Required<ToastConfig> {
  id: string;
  dismissing: boolean;
}

const LEAVE_MS = 200;

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULTS = {
  duration: 3000,
  position: 'lower-center' as ToastPosition,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(config: ToastConfig): string {
    const toast: Toast = {
      type: config.type,
      message: config.message,
      duration: config.duration ?? DEFAULTS.duration,
      position: config.position ?? DEFAULTS.position,
      id: generateId(),
      dismissing: false,
    };

    this.toasts.update(list => [...list, toast]);

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }

    return toast.id;
  }

  dismiss(id: string): void {
    this.toasts.update(list =>
      list.map(t => (t.id === id ? { ...t, dismissing: true } : t)),
    );

    setTimeout(() => {
      this.toasts.update(list => list.filter(t => t.id !== id));
    }, LEAVE_MS);
  }
}
