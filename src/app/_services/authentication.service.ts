import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AlertService } from 'src/app/_services';
import { ErrorHandler } from 'src/app/_helpers';

@Injectable()
export class AuthenticationService {
    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandler) { }

    login(email: string, password: string) {
        const loginViewModel = {
            Email: email,
            Password: password
        };

        return this.http.post<any>('http://localhost:57911/api/login', loginViewModel)
            .pipe(
                map(user => {
                if (user && user.accessToken) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }}),
                catchError(this.errorHandler.getError)
            );
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
