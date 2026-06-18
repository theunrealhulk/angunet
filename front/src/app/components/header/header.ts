import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeSwitcherButton } from '../ui/themeSwitcher/theme-switcher-button';
import { MatIcon } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";
import { Authentication } from '../../services/authentication';
import { Router } from '@angular/router';
import { ToastService } from '../ui/toast-notification/toast.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, ThemeSwitcherButton, MatIcon, MatAnchor],
  templateUrl: `header.html`,
  styles: `
   .example-spacer {
      flex: 1 1 auto;
    }`,
})
export class Header {
  constructor(private authService: Authentication, private router: Router,private toast:ToastService) { }
  logOut = () => {
    //
    this.authService.logout().subscribe({

      next: () => {
        this.router.navigate(["/"])
      },
      error:()=>{
        this.toast.show({type:"error",message:"unable to logout"})
      }
    })
  }
}
