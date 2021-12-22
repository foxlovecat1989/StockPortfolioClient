import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { NotificationService } from './service/notification.service';
import { NotificationModule } from './notification.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdminComponent } from './admin/admin.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { TradeComponent } from './trade/trade.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TradeExecuteModalComponent } from './trade/trade-execute-modal/trade-execute-modal.component';
import { InventoryComponent } from './inventory/inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    WrapperComponent,
    DashboardComponent,
    UserComponent,
    UserProfileComponent,
    LogoutComponent,
    AdminComponent,
    ManageUserComponent,
    TradeComponent,
    TradeExecuteModalComponent,
    InventoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    NgbModule
  ],
  entryComponents:[
    TradeExecuteModalComponent
  ],
  providers: [
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
