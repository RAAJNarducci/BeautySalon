import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { JobComponent } from './job/job.component';
import { JobListComponent } from './job-list/job-list.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'customer/:id', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'customer-list', component: CustomerListComponent, canActivate: [AuthGuard] },

  { path: 'job', component: JobComponent, canActivate: [AuthGuard] },
  { path: 'job/:id', component: JobComponent, canActivate: [AuthGuard] },
  { path: 'job-list', component: JobListComponent, canActivate: [AuthGuard] },

  { path: 'scheduling', component: SchedulingComponent, canActivate: [AuthGuard] },

  { path: 'config', component: ConfigComponent },

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
