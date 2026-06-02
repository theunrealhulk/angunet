import { Component } from '@angular/core';
import { anInput } from "../../components/ui/input/anInput";
import { MatAnchor } from "@angular/material/button";
import { ToastService } from "../../components/ui/toast-notification/toast.service";

@Component({
  selector: 'app-login',
  imports: [anInput, MatAnchor],
  templateUrl: `login.html`,
  styles: ``,
})
export class Login {
  constructor(private readonly toast: ToastService) {}

  protected login = () => {
    this.toast.show({ type: 'info', message: 'Work in progress...' });
  }
}
