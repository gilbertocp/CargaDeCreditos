import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckloginGuard implements CanActivate {

  constructor(
    private authSvc: AuthService,
    private router: Router  
  ) { }

  canActivate(): Observable<boolean> {
    return this.authSvc.user$.pipe(map(user => {
      if(user) {
        this.router.navigate(['/home']);
        return false;
      }

      return true;
    }));
  }
}
