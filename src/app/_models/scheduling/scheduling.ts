export interface IAgendamentoResponse {
    id: number;
    nomeCliente: string;
    descricaoServico: string;
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
