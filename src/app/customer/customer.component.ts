import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViacepService } from '../_services';
import { ViaCep, CepError } from '../_models';
import { ActivatedRoute } from '@angular/router';
import { UFs } from '../_models/Uf';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {

  customerForm: FormGroup;
  submitted = false;
  ufsData = UFs;
  private sub: any;

  constructor(
    private formBuilder: FormBuilder,
    private _viaCepService: ViacepService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf:  ['', [Validators.required, Validators.minLength(11)]],
      telefone:  ['', [Validators.required, Validators.minLength(10)]],
      dataNascimento: ['', [Validators.required, Validators.minLength(8)]],
      cep:  ['', [Validators.required, Validators.minLength(8)]],
      uf: ['', [Validators.required, Validators.minLength(2)]],
      logradouro:  ['', Validators.required],
      numero:  ['', Validators.required],
      bairro:  ['', Validators.required],
      complemento:  ['', Validators.required],
      cidade:  ['', Validators.required],
    });

    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerForm.patchValue({
          nome: 'Relson',
          cpf: '41281804835'
        });
      }
    });
  }

  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
            return;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
