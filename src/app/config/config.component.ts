import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  configForm: FormGroup;
  submitted = false;
  private sub: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.configForm = this.formBuilder.group({
      horarioDe: ['', Validators.required],
      horarioAte:  ['', Validators.required],
      atendimentosSimultaneos: ['', Validators.required]
    });
  }

}
