export type ToastType = 'info' | 'warning' | 'error' | 'success';

export type ToastPosition =
  | 'upper-left'
  | 'upper-center'
  | 'upper-right'
  | 'lower-left'
  | 'lower-center'
  | 'lower-right';

export interface ToastConfig {
  type: ToastType;
  message: string;
  duration?: number;
  position?: ToastPosition;
}
