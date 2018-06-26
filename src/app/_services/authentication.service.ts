import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        const loginViewModel = {
            Email: email,
            Password: password
        };

        return this.http.post<any>('http://localhost:57911/api/login', loginViewModel)
            .pipe(map(user => {
                if (user && user.accessToken) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
