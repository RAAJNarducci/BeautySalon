import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViacepService, CustomerService } from '../_services';
import { ViaCep, CepError, ICustomer } from '../_models';
import { ActivatedRoute, Router } from '@angular/router';
import { UFs } from '../_models/Uf';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

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
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _viaCepService: ViacepService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      id: [0, null],
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
        this.buscarPorId(parseInt(params['id'], 0));
      }
    });
  }

  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
            return;
    }
    const {id, cpf, nome, dataNascimento, telefone,
      bairro, cep, cidade, complemento, logradouro, numero, uf } = this.customerForm.value;
    const dataNascimentoFormatada = new Date(
      dataNascimento.substr(4, 4),
      dataNascimento.substr(2, 2) - 1,
      dataNascimento.substr(0, 2));
    const customer: ICustomer = {
      cpf,
      dataNascimento: dataNascimentoFormatada.toJSON(),
      endereco: {bairro, cep, cidade, complemento,
      logradouro, numero, estado: uf },
      id: id,
      nome,
      telefone
    };
    this.save(customer);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save(customer: ICustomer) {
    if (customer.id === 0) {
      this.customerService.post(customer)
      .subscribe(
        () => {
          this.toastr.success('Cliente cadastrado', 'Sucesso!');
          this.customerForm.reset();
        },
        err => console.log(err)
      );
    } else {
      this.customerService.put(customer)
      .subscribe(
        () => {
          this.toastr.success('Cliente alterado', 'Sucesso!');
          this.router.navigate(['/customer-list']);
        },
        err => console.log(err)
      );
    }
  }

  buscarPorId(id: number) {
    this.customerService.buscarPorId(id).pipe(
      map(val => {
        this.customerForm.patchValue({
          id: val.id,
          nome: val.nome,
          cpf:  val.cpf,
          telefone:  val.telefone,
          dataNascimento: val.dataNascimentoSemMascara,
          cep:  val.endereco.cep,
          uf: val.endereco.estado,
          logradouro: val.endereco.logradouro,
          numero:  val.endereco.numero,
          bairro:  val.endereco.bairro,
          complemento:  val.endereco.complemento,
          cidade:  val.endereco.cidade
        });
      })
    ).subscribe();
  }
}
