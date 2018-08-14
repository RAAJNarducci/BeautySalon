import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { ISearchCustomerParams, ICustomer, ICustomerResponse } from '../_models/customer/customer';
import { Observable, of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorHandler } from '../_helpers';

@Injectable()
export class CustomerService {
    customers: ICustomer[];

    constructor(private http: HttpClient,
        private errorHandler: ErrorHandler) {}

    buscarPessoas(params: ISearchCustomerParams, pagination: any) {
        const queryParams = Object.keys(params)
        .filter(key => params[key] || params[key] === false)
        .map(key => `${key}=${params[key]}`)
        .join('&');

        const queryPagination = Object.keys(pagination)
        .filter(key => pagination[key] || pagination[key] === false)
        .map(key => `${key}=${pagination[key]}`)
        .join('&');

        return this.http.get<ICustomerResponse>(`http://localhost:57911/api/Pessoa/BuscarPessoas?${queryParams}&${queryPagination}`)
        .pipe(
            catchError(this.errorHandler.getError)
        );
    }

    buscarPorId(id: number) {
        return this.http.get<ICustomer>(`http://localhost:57911/api/Pessoa/GetById?id=${id}`)
        .pipe(
            catchError(this.errorHandler.getError)
        );
    }

    post(customer: ICustomer) {
        return this.http.post<any> (`http://localhost:57911/api/Pessoa`, customer)
        .pipe(
            catchError(this.errorHandler.getError)
        );
    }

    put(customer: ICustomer) {
        return this.http.put<any> (`http://localhost:57911/api/Pessoa`, customer)
        .pipe(
            catchError(this.errorHandler.getError)
        );
    }
}
