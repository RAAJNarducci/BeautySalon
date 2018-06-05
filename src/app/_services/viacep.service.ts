import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ViaCep, CepError } from '../_models';

@Injectable()
export class ViacepService {
    private serviceUrl = 'https://viacep.com.br/ws';

    constructor(private http: HttpClient) {
    }

    buscarPorCep( cep: string ): Promise<ViaCep|CepError> {

        if (cep.length !== 8 ) {
          return this.customError('CEP_INVALIDO');
        }
        const uri = encodeURI(`${this.serviceUrl}/${cep}/json`);
        return this.http.get<ViaCep>(uri).toPromise().catch(( error ) => {
          return this.customError('ERRO_SERVIDOR');
        });
    }

    protected customError( type: string ): Promise<CepError> {

        return new Promise<CepError>(( resolve, reject ) => {
          reject({error: true, descricao: type });
        });
      }
}
