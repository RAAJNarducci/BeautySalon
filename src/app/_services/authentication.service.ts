import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        const loginViewModel = {
            Email: username,
            Password: password,
            RememberMe: true
        };

        return this.http.post<any>('/api/authenticate', { username: username, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
        // return this.http.post<any>('http://localhost:57911/api/login', loginViewModel)
        //     .pipe(map(user => {
        //         // login successful if there's a jwt token in the response
        //         if (user && user.token) {
        //             // store user details and jwt token in local storage to keep user logged in between page refreshes
        //             localStorage.setItem('currentUser', JSON.stringify(user));
        //         }
        //         return user;
        //     }));
    }

    // login(username: string, password: string) {
    //     const model = {
    //         Email: 'teste@teste.com',
    //         Password: 'Teste#123'
    //     };
    //     return this.http.post('http://localhost:57911/api/Account/register', model);
    //     // return this.http.post<any>('/api/authenticate', { username: username, password: password })
    //     //     .pipe(map(user => {
    //     //         // login successful if there's a jwt token in the response
    //     //         if (user && user.token) {
    //     //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     //             localStorage.setItem('currentUser', JSON.stringify(user));
    //     //         }

    //     //         return user;
    //     //     }));
    // }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
