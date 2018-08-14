import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID  } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

// used to create fake backend
import { fakeBackendProvider, ErrorHandler } from './_helpers';
import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, ViacepService, CustomerService } from './_services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxPhoneMaskBrModule } from 'ngx-phone-mask-br';
import { NgxMaskModule } from 'ngx-mask';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { CalendarModule } from 'angular-calendar';
import { CalendarUtilsModule } from '../app/_directives/calendar/calendar.module';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ngx-currency-mask/src/currency-mask.config';


import { CustomerListComponent } from './customer-list/customer-list.component';
import { JobComponent } from './job/job.component';
import { JobListComponent } from './job-list/job-list.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { SchedulingService } from './_services/scheduling.service';
import { ConfigComponent } from './config/config.component';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.'
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CustomerComponent,
    LoginComponent,
    AlertComponent,
    RegisterComponent,
    CustomerListComponent,
    JobComponent,
    JobListComponent,
    SchedulingComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    NgxPhoneMaskBrModule,
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 2000,
    }),
    CurrencyMaskModule,
    CalendarModule.forRoot(),
    CalendarUtilsModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
    },
    ViacepService,
    CustomerService,
    SchedulingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    // provider used to create fake backend
    // fakeBackendProvider,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: LOCALE_ID, useValue: 'pt' },
    ErrorHandler
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
