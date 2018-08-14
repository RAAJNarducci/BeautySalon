import { IPagination } from '../pagination/pagination';

export interface ICustomer {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    dataNascimentoSemMascara?: string;
    telefone: string;
    endereco: IAdress;
}

export interface IAdress {
    cep: string;
    estado: string;
    logradouro: string;
    bairro: string;
    numero: string;
    cidade: string;
    complemento: string;
}

export interface ISearchCustomerParams {
    nome?: string;
    cpf?: string;
    pagination: IPagination;
}

export interface ICustomerResponse {
    pessoas: ICustomer[];
    totalItens: number;
}

export interface ICustomerGet {
    id: number;
    nome: string;
}
