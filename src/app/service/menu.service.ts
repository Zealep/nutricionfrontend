import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    BASE_URL = environment.url_api;
    ROLE_DEFAULT = environment.rol_default;

  constructor(private http: HttpClient) { }
  getAllByRol(){
    return this.http.get(`${this.BASE_URL}/menu/rol/${this.ROLE_DEFAULT}`)
    .pipe(catchError(this.handleErrorDefault));
  }

  private handleErrorDefault(error: HttpErrorResponse) {
  return throwError(() => error.error);
}
}
