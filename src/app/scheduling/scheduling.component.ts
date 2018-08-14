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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IJob, ICustomerGet, IAgendamentoResponse, IAgendamento } from '../_models';
import { SchedulingService } from '../_services/scheduling.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { EnumCores } from '../_helpers';

export const customers: ICustomerGet[] = [
  {'id': 1, 'nome': 'João', },
  {'id': 2, 'nome': 'Maria'},
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
  modalRef: NgbModalRef;
  editScheduling = null;
  statusScheduling = '';

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private schedulingService: SchedulingService
  ) {}

  get f() { return this.schedulingForm.controls; }

  ngOnInit(): void {
    this.schedulingForm = this.formBuilder.group({
      id: [0, Validators.required],
      dataAgendamento: ['', Validators.required],
      horarioAgendamento: ['', Validators.required],
      idCliente: ['', Validators.required],
      idServico: ['', Validators.required],
      tempoPrevisto: ['', Validators.required],
    });
    this.listarServicos();
    this.getByDate();
  }

  listarServicos() {
    this.schedulingService.listarServicos()
      .pipe(
        map(se => this.jobs = se)
      ).subscribe();
  }

  getByDate() {
    this.schedulingService.getByDate(this.viewDate)
    .pipe(
      map(ag =>
        this.agendamentos = this.converterAgendamentoEvento(ag))
    ).subscribe();
  }

  closeModal() {
    this.schedulingForm.reset();
    this.schedulingForm.patchValue({
      idCliente: '',
      idServico: ''
    });
    this.modalRef.close();
  }

  save(agendamento: IAgendamento) {
    this.schedulingService.post(agendamento)
    .subscribe(
      () => {
        this.closeModal();
        this.toastr.success('Agendamento realizado', 'Sucesso!');
      },
      err => console.log(err)
    );
  }

  editStatus(status) {
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
      idCliente: parseInt(form.idCliente.value, 0),
      idServico: parseInt(form.idServico.value, 0),
      tempoPrevisto: parseInt(form.tempoPrevisto.value, 0),
      id: form.id.value
    };

    this.save(ag);
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
          title: el.cliente.nome + ' / ' + el.servico.descricao,
          start: horarioInicio,
          end: addMinutes(horarioInicio, el.minutos),
          color: el.statusAgendamento.id === 1 ? colors.yellow : el.statusAgendamento.id === 2 ? colors.blue : colors.red,
          meta: {
            agendamento: el
          }
      };
      listaAgendamentos.push(evento);
    });
    return listaAgendamentos;
  }

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
      horarioAgendamento: this.formatYour(data),
    });
    this.editScheduling = null;
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  eventClicked(event: CalendarEvent<{ agendamento: IAgendamentoResponse }>, content): void {
    const { dataFormatada, horarioInicio, id, minutos, cliente, servico, statusAgendamento } = event.meta.agendamento;
    this.schedulingForm.patchValue({
      dataAgendamento: dataFormatada,
      horarioAgendamento: horarioInicio,
      idCliente: cliente.id,
      idServico: servico.id,
      tempoPrevisto: minutos,
      id: id,
    });
    this.editScheduling = true;
    this.statusScheduling = statusAgendamento.descricao;
    this.modalRef = this.modalService.open(content, { size: 'lg' });
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
