import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  jobForm: FormGroup;
  submitted = false;
  private sub: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.jobForm = this.formBuilder.group({
      id: ['', null],
      descricao: ['', Validators.required],
      tempoPrevisto: ['', Validators.required],
      valor: ['', Validators.required],
    });

    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.jobForm.patchValue({
          id: 1,
          descricao: 'Corte',
          tempoPrevisto: 60,
          valor: 50
        });
      }
    });
  }

  get f() { return this.jobForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.jobForm.invalid) {
            return;
    }
  }

}
