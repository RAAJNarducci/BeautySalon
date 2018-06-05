import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarDateFormatter } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  addHours,
  addDays,
  addMinutes
} from 'date-fns';
import { Observable } from 'rxjs';
import { colors } from '../_directives/calendar/colors';
import { CustomDateFormatter } from '../_directives/calendar/custom-date-formatter';

interface Film {
  id: number;
  title: string;
  release_date: string;
}

interface AgendamentoResponse {
  Id: number;
  NomeCliente: string;
  DescricaoServico: string;
  HorarioInicio: string;
  Minutos: number;
  DataFormatada: string;
}


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit {

  view = 'month';

  viewDate: Date = new Date();

  events: Observable<Array<CalendarEvent<{ film: Film }>>>;
  agendamentos: CalendarEvent[];

  activeDayIsOpen = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.fetchEvents();
    this.obterAgendamentos();
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
        start: new Date(2018, 5, 4, 10, 0, 0, 0),
        end: new Date(2018, 5, 4, 11, 0, 0, 0),
        color: colors.yellow,
        meta: {
          agendamento: agendamentosMock[0].Id
        }
      },
      {
        title: agendamentosMock[1].NomeCliente + ' / ' + agendamentosMock[1].DescricaoServico,
        start: new Date(2018, 5, 4, 11, 0, 0, 0),
        end: new Date(2018, 5, 4, 12, 0, 0, 0),
        color: colors.yellow,
        meta: {
          agendamento: agendamentosMock[1].Id
        }
      },
    ];
    this.agendamentos = eventMock;
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    const params = new HttpParams()
      .set(
        'primary_release_date.gte',
        format(getStart(this.viewDate), 'YYYY-MM-DD')
      )
      .set(
        'primary_release_date.lte',
        format(getEnd(this.viewDate), 'YYYY-MM-DD')
      )
      .set('api_key', '0ec33936a68018857d727958dca1424f');
    this.events = this.http
      .get('https://api.themoviedb.org/3/discover/movie', { params })
      .pipe(
        map(({ results }: { results: Film[] }) => {
          return results.map((film: Film) => {
            return {
              title: film.title,
              start: new Date(film.release_date),
              color: colors.yellow,
              meta: {
                film
              }
            };
          });
        })
      );
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ film: Film }>>;
  }): void {
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

  hourClicked(hora: any) {
  }

  eventClicked(event: CalendarEvent<{ agendamento: AgendamentoResponse }>): void {
    alert(event.meta.agendamento);
  }

}
