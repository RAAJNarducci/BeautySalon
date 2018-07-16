import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  addMinutes,
} from 'date-fns';
import { Observable } from 'rxjs';
import { colors } from '../_directives/calendar/colors';
import { CustomDateFormatter } from '../_directives/calendar/custom-date-formatter';
import { CustomEventTitleFormatter } from '../_directives/calendar/custom-title-formatter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IJob, ICustomerGet, IAgendamentoResponse, IAgendamento } from '../_models';
import { SchedulingService } from '../_services/scheduling.service';
import { map } from 'rxjs/operators';

export const customers: ICustomerGet[] = [
  {'Id': 1, 'Nome': 'João', },
  {'Id': 2, 'Nome': 'Maria'},
];


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit {

  activeDayIsOpen = false;
  submitted = false;
  view = 'month';
  customers = customers;
  jobs = [];
  schedulingForm: FormGroup;
  viewDate: Date = new Date();
  events: Observable<Array<CalendarEvent<{ agendamento: IAgendamentoResponse }>>>;
  agendamentos: CalendarEvent[] = [];



  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private schedulingService: SchedulingService
  ) {}

  ngOnInit(): void {
    this.listarServicos();
    this.schedulingForm = this.formBuilder.group({
      dataAgendamento: ['', Validators.required],
      horarioAgendamento: ['', Validators.required],
      idCliente: ['', Validators.required],
      idServico: ['', Validators.required],
      tempoPrevisto: ['', Validators.required],
    });
    this.schedulingService.getByDate(this.viewDate)
    .pipe(
      map(ag =>
        this.agendamentos = this.converterAgendamentoEvento(ag))
    ).subscribe();
  }

  listarServicos() {
    this.schedulingService.listarServicos()
      .pipe(
        map(se => this.jobs = se)
      ).subscribe();
  }

  onSubmit() {
    this.submitted = true;
    if (this.schedulingForm.invalid) {
            return;
    }
    const form = this.schedulingForm.controls;
    const ag: IAgendamento = {
      dataAgendamento: form.dataAgendamento.value,
      horarioAgendamento: form.horarioAgendamento.value,
      idCliente: form.idCliente.value,
      idServico: form.idServico.value,
      tempoPrevisto: form.tempoPrevisto.value,
      id: 0
    };

    this.agendamentos.push({
      title: 'teste ' + ' / ' + 'corte degladê',
      start: new Date(2018, 5, 21, 14, 15, 0, 0),
      end: new Date(2018, 5, 21, 15, 0, 0, 0),
      color: colors.yellow,
      meta: {
        agendamento: 3
      }
    });
  }

  converterAgendamentoEvento(agendamento: IAgendamentoResponse[]) {
    const listaAgendamentos = [];
    agendamento.forEach(el => {
      const data = el.dataFormatada.split('/');
      const mes = parseInt(data[1], 0);
      const hora = el.horarioInicio.split(':');
      const horarioInicio = new Date(
        +data[2],
        mes - 1,
        +data[0],
        +hora[0],
        +hora[1]);
      const evento: CalendarEvent = {
          title: el.nomeCliente + ' / ' + el.descricaoServico,
          start: horarioInicio,
          end: addMinutes(horarioInicio, el.minutos),
          color: colors.yellow,
          meta: {
            agendamento: el
          }
      };
      listaAgendamentos.push(evento);
    });
    return listaAgendamentos;
  }

  get f() { return this.schedulingForm.controls; }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ agendamento: IAgendamentoResponse }>>;
  }): void {
    if (!events.length) {
      this.viewDate = date;
      this.view = 'day';
    }
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  hourClicked(content, data: any) {
    this.schedulingForm.patchValue({
      dataAgendamento: this.formatDate(data),
      horarioAgendamento: this.formatYour(data)
    });
    this.modalService.open(content, { size: 'lg' });
  }

  openScheduling() {

  }

  eventClicked(event: CalendarEvent<{ agendamento: IAgendamentoResponse }>): void {
    console.log(event.meta.agendamento);
  }

  formatDate(data) {
    let dia = data.getDate();
    if (dia.toString().length === 1) {
      dia = '0' + dia;
    }
    let mes = data.getMonth() + 1;
    if (mes.toString().length === 1) {
      mes = '0' + mes;
    }
    const ano = data.getFullYear();
    return dia + '' + mes + '' + ano;
  }

  formatYour(data) {
    let hora = data.getHours();
    if (hora.toString().length === 1) {
      hora = '0' + hora;
    }
    let minutos = data.getMinutes();
    if (minutos.toString().length === 1) {
      minutos = '0' + minutos;
    }

    return hora + '' + minutos;
  }

  setTime() {
    const idServico = this.schedulingForm.controls['idServico'].value;
    if (+idServico) {
      const timeJob = this.jobs.find(x => x.id === +idServico);
      if (timeJob) {
        this.schedulingForm.patchValue({
          tempoPrevisto: timeJob.tempoPrevisto
        });
      }
    }
  }
}
