import { Component, OnInit } from '@angular/core';
import { ICustomer } from '../_models';
import { ISearchCustomerParams } from '../_models/customer/customer';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, Subscription } from 'rxjs';
import { CustomerService } from '../_services/customer.service';
import { finalize, switchMap,  } from 'rxjs/operators';
import { Router, Route } from '@angular/router';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  searchForm: FormGroup;
  submitted = false;
  customers: ICustomer[];
  id: 0;
  pagination = {
    totalItems: 0,
    limit: 10,
    page: 1
  };

  constructor(
    private _customerService: CustomerService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      nome: ['', null],
      cpf: ['', Validators.minLength(11)]
    });
    this.customers = this.getMock();
    this.pagination.totalItems = this.getMock().length;
  }

  get f() { return this.searchForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
            return;
    }
  }

  edit(id) {
    this.router.navigate(['/customer', id]);
  }

  delete() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  confirmDelete(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  getMock() {
    const cliente: ICustomer[] = [{
        Id: 1,
        Bairro: 'Centro',
        Cep: '14801-790',
        Cidade: 'Araraquara',
        Complemento: 'Ap',
        Cpf: '412.818.048-77',
        DataNascimento: '13/05/1994',
        Logradouro: 'Rua 1',
        Nome: 'Relson',
        Numero: '123',
        Telefone: '(16)3256-9874',
        Uf: 'SP'
      }
    ];

    return cliente;
  }
}
