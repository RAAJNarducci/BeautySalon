import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay
} from 'date-fns';
import { Observable } from 'rxjs';
import { colors } from '../_directives/calendar/colors';
import { CustomDateFormatter } from '../_directives/calendar/custom-date-formatter';
import { CustomEventTitleFormatter } from '../_directives/calendar/custom-title-formatter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IJob, ICustomerGet } from '../_models';

interface AgendamentoResponse {
  Id: number;
  NomeCliente: string;
  DescricaoServico: string;
  HorarioInicio: string;
  Minutos: number;
  DataFormatada: string;
}

interface Agendamento {
  Id: number;
  DataAgendamento: string;
  HorarioAgendamento: string;
  IdCliente: number;
  IdServico: number;
  TempoPrevisto: number;
}

export const jobs: IJob[] = [
  {'Id': 1, 'Descricao': 'Corte', 'TempoPrevisto': 60, 'Valor': 60.0 },
  {'Id': 2, 'Descricao': 'Pintura', 'TempoPrevisto': 90, 'Valor': 100.0 },
  {'Id': 3, 'Descricao': 'Escova', 'TempoPrevisto': 120, 'Valor': 150.0 },
];

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
  jobs = jobs;
  schedulingForm: FormGroup;
  viewDate: Date = new Date();
  events: Observable<Array<CalendarEvent<{ agendamento: AgendamentoResponse }>>>;
  agendamentos: CalendarEvent[];



  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.schedulingForm = this.formBuilder.group({
      dataAgendamento: ['', Validators.required],
      horarioAgendamento: ['', Validators.required],
      idCliente: ['', Validators.required],
      idServico: ['', Validators.required],
      tempoPrevisto: ['', Validators.required],
    });
    this.obterAgendamentos();
  }

  onSubmit() {
    this.submitted = true;
    if (this.schedulingForm.invalid) {
            return;
    }
    const form = this.schedulingForm.controls;
    const ag: Agendamento = {
      DataAgendamento: form.dataAgendamento.value,
      HorarioAgendamento: form.horarioAgendamento.value,
      IdCliente: form.idCliente.value,
      IdServico: form.idServico.value,
      TempoPrevisto: form.tempoPrevisto.value,
      Id: 0
    };
    console.log(ag);

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

  obterAgendamentos(): void {
    const agendamentosMock: AgendamentoResponse[] = [{
        Id: 1,
        DataFormatada: '06-04-2018',
        HorarioInicio: '10:00:00',
        Minutos: 60,
        NomeCliente: 'Rita',
        DescricaoServico: 'Corte + Pintura'
      },
      {
        Id: 2,
        DataFormatada: '06-04-2018',
        HorarioInicio: '11:00:00',
        Minutos: 60,
        NomeCliente: 'Patrícia',
        DescricaoServico: 'Escova'
      }
    ];
    const eventMock: CalendarEvent[] = [
      {
        title: agendamentosMock[0].NomeCliente + ' / ' + agendamentosMock[0].DescricaoServico,
        start: new Date(2018, 5, 4, 10, 30, 0, 0),
        end: new Date(2018, 5, 4, 11, 0, 0, 0),
        color: colors.yellow,
        meta: {
          agendamento: agendamentosMock[0]
        }
      },
      {
        title: agendamentosMock[1].NomeCliente + ' / ' + agendamentosMock[1].DescricaoServico,
        start: new Date(2018, 5, 4, 11, 0, 0, 0),
        end: new Date(2018, 5, 4, 12, 0, 0, 0),
        color: colors.yellow,
        meta: {
          agendamento: agendamentosMock[1]
        }
      },
    ];
    this.agendamentos = eventMock;
  }

  get f() { return this.schedulingForm.controls; }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ agendamento: AgendamentoResponse }>>;
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

  eventClicked(event: CalendarEvent<{ agendamento: AgendamentoResponse }>): void {
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
      const timeJob = jobs.find(x => x.Id === +idServico);
      if (timeJob) {
        this.schedulingForm.patchValue({
          tempoPrevisto: timeJob.TempoPrevisto
        });
      }
    }
  }
}
