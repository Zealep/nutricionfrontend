import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Protocolo } from '../model/protocolo';
import { catchError, throwError } from 'rxjs';
import { Inseminacion } from '../model/inseminacion';

@Injectable({
  providedIn: 'root'
})
export class InseminacionService {
    URL_BACKEND: string = `${environment.url_api}/inseminacion`;

constructor(private http: HttpClient) { }

getAll() {
    return this.http.get<Inseminacion[]>(`${this.URL_BACKEND}`)
    .pipe(catchError(this.handleErrorDefault));
 }

getById(id: number) {
    return this.http.get<Inseminacion>(`${this.URL_BACKEND}/${id}`)
    .pipe(catchError(this.handleErrorDefault));

}

save(req: Inseminacion) {
    return this.http.post(`${this.URL_BACKEND}`, req)
    .pipe(catchError(this.handleErrorDefault));
}

delete(id: number) {
    return this.http.delete(`${this.URL_BACKEND}/${id}`)
    .pipe(catchError(this.handleErrorDefault));
}
  private handleErrorDefault(error: HttpErrorResponse) {
  return throwError(() => error.error);
}
}
