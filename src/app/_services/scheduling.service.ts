import { HttpClient } from '@angular/common/http';
import { IAgendamentoResponse, IJob } from '../_models';
import { map, catchError, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ErrorHandler } from '../_helpers';

@Injectable()
export class SchedulingService {
    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandler) {
    }

    getByDate(date: Date) {
        const url = `http://localhost:57911/api/Agendamento?data=${date.toJSON()}`;
        return this.http.get<IAgendamentoResponse[]>(url)
        .pipe(
            first(),
            catchError(this.errorHandler.getError)
        );
    }

    listarServicos() {
        return this.http.get<IJob[]>(`http://localhost:57911/api/Agendamento/ListarServicos`)
        .pipe(
            catchError(this.errorHandler.getError)
        );
    }
}
