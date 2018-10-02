import { ICustomer } from '..';
import { IJob } from '../job/job';

export interface IAgendamentoResponse {
    id: number;
    cliente: ICustomer;
    servico: IJob;
    statusAgendamento: IStatusAgendamento;
    horarioInicio: string;
    minutos: number;
    dataFormatada: string;
  }

export interface IAgendamento {
    id: number;
    dataAgendamento: string;
    horarioAgendamento: string;
    idCliente: number;
    idServico: number;
    tempoPrevisto: number;
  }

export interface IStatusAgendamento {
    id: number;
    descricao: string;
  }
