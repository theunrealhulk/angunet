import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ToastService } from '../components/ui/toast-notification/toast.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/models/User';



const API_URL = `http://localhost:5046/api/auth`
@Injectable({
  providedIn: 'root',
})
export class Authentication {
  constructor(private http: HttpClient, private readonly toast: ToastService,) { }
  readonly currentUser = signal<User | null>(null);

  
  login = (email: string, password: string): Observable<any> => {
    return this.http.post(`${API_URL}/login`, { email, password }, { withCredentials: true })
  }
  sendEmailVerificationCode = (email: string):Observable<any> => {
    console.log('sending email verification code to ' + email)
    return this.http.post(`${API_URL}/send-code`, { email })
  }
  verifyCode = (code: string, email: string):Observable<any> => {
    return this.http.post(`${API_URL}/verify-code`, { code, email })
  }
  register = (email: string, fullName: string, password: string): Observable<any> => {
    return this.http.post(`${API_URL}/register`, { email, fullName, password })
  }
  updatePassword = (newPassword: string, email: string): Observable<any> => {
    return this.http.post(`${API_URL}/update-password`, { newPassword, email })
  }
  checkAuthStatus = (): Observable<any> => {
    return this.http.get(`${API_URL}/me`, { withCredentials: true }).pipe(
      tap(user => this.currentUser.set(user as User)), 
      map(() => true),
      catchError(() => {
        this.currentUser.set(null); // Clear signal on failure
        return of(false); // Return false to the guard
      }))
  }
  logout = (): Observable<any> => {
    return this.http.post(`${API_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.currentUser.set(null)) // Clear current user on logout
    );
  }
}
