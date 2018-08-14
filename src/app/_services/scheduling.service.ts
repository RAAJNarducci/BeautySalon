import { HttpClient, HttpResponse } from '@angular/common/http';
import { IAgendamentoResponse, IJob, IAgendamento } from '../_models';
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

    post(agendamento: IAgendamento) {
        return this.http.post<any> (`http://localhost:57911/api/Agendamento`, agendamento)
        .pipe(
            catchError(this.errorHandler.getError)
        );
    }
}
