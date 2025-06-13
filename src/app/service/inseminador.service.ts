import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Protocolo } from '../model/protocolo';
import { catchError, throwError } from 'rxjs';
import { Inseminacion } from '../model/inseminacion';
import { Inseminador } from '../model/inseminador';

@Injectable({
  providedIn: 'root'
})
export class InseminadorService {
    URL_BACKEND: string = `${environment.url_api}/inseminador`;

constructor(private http: HttpClient) { }

getAll() {
    return this.http.get<Inseminador[]>(`${this.URL_BACKEND}`)
    .pipe(catchError(this.handleErrorDefault));
 }

getById(id: number) {
    return this.http.get<Inseminador>(`${this.URL_BACKEND}/${id}`)
    .pipe(catchError(this.handleErrorDefault));

}

save(req: Inseminador) {
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
