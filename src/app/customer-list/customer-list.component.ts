import { Component, OnInit, PipeTransform } from '@angular/core';
import { ICustomer } from '../_models';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../_services/customer.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  searchForm: FormGroup;
  customers: ICustomer[];
  modalRef: NgbModalRef;
  submitted = false;
  id: 0;
  totalItens: 0;

  pagination = {
    totalItems: 0,
    quantidadePagina: 10,
    pagina: 1
  };

  constructor(
    private customerService: CustomerService,
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
    this.search();
  }

  get f() { return this.searchForm.controls; }

  search() {
    this.customerService.buscarPessoas(this.searchForm.value, this.pagination).pipe(
      map(val => {
          this.customers = val.pessoas,
          this.pagination.totalItems = val.totalItens;
        })
    ).subscribe();
  }

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
    this.customerService.delete(this.id).pipe(
      map(() => {
        this.modalRef.close();
        this.search();
        this.toastr.success('Cliente excluído', 'Sucesso!');
      })
    ).subscribe();
  }

  confirmDelete(content, id) {
    this.id = id;
    this.modalRef = this.modalService.open(content);
  }

  getPage(page) {
    this.pagination.pagina = page;
    this.search();
  }
}
