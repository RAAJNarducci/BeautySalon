import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IJob } from '../_models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  searchForm: FormGroup;
  submitted = false;
  jobs: IJob[];
  id: 0;
  pagination = {
    totalItems: 0,
    limit: 10,
    page: 1
  };
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      descricao: ['', null],
    });
    this.jobs = this.getMock();
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
    this.router.navigate(['/job', id]);
  }

  delete() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  confirmDelete(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  getMock() {
    const servico: IJob[] = [{
        Id: 1,
        Descricao: 'Corte',
        TempoPrevisto: 60,
        Valor: 50.00
      }
    ];

    return servico;
  }

}
