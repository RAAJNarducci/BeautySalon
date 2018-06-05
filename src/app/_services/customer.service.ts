import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { ISearchCustomerParams, ICustomer, ICustomerResponse } from '../_models/customer/customer';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomerService {
    customers: ICustomer[];

    constructor(private http: HttpClient) {}

    searchCustomer(params: ISearchCustomerParams):
    Observable<{ customers: ICustomer[], totalItems: number }> {

    const queryParams = Object.keys(params)
      .filter(key => params[key] || params[key] === false)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const url = `/customer/search?${queryParams}`;
    return this.http
        .get<ICustomerResponse>(url)
        .pipe(
            map(customer => {
                return { customers: this.getMock(), totalItems: this.getMock().length };
            })
        );
    }

    getMock() {
        const cliente: ICustomer[] = [{
            Id: 1,
            Bairro: 'Centro',
            Cep: '14801790',
            Cidade: 'Araraquara',
            Complemento: 'Ap',
            Cpf: '41281804877',
            DataNascimento: '13051994',
            Logradouro: 'Rua 1',
            Nome: 'Relson',
            Numero: '123',
            Telefone: '1632569874',
            Uf: 'SP'
          }
        ];

        return cliente;
    }
}
