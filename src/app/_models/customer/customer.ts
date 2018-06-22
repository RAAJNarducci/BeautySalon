export interface ICustomer {
    Id: number;
    Nome: string;
    Cpf: string;
    DataNascimento: string;
    Telefone: string;
    Cep: string;
    Uf: string;
    Logradouro: string;
    Bairro: string;
    Numero: string;
    Cidade: string;
    Complemento: string;
}

export interface ISearchCustomerParams {
    Nome?: string;
    Cpf?: string;
}

export interface ICustomerResponse {
    customers: ICustomer[];
    totalItens: number;
}

export interface ICustomerGet {
    Id: number;
    Nome: string;
}
