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
import { LogoutComponent } from './components/logout/logout.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { TradeComponent } from './trade/trade.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TradeExecuteModalComponent } from './trade/trade-execute-modal/trade-execute-modal.component';
import { InventoryComponent } from './inventory/inventory.component';
import { StockComponent } from './stock/stock.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistModalComponent } from './watchlist/watchlist-modal/watchlist-modal.component';
import { ConfirmModalComponent } from './watchlist/confirm-modal/confirm-modal.component';
import { AddStockToWatchlistModalComponent } from './stock/add-stock-to-watchlist-modal/add-stock-to-watchlist-modal.component';
import { AddUserModalComponent } from './admin/manage-user/add-user-modal/add-user-modal.component';
import { UpdateUserModalComponent } from './admin/manage-user/update-user-modal/update-user-modal.component';
import { DeleteUserModalComponent } from './admin/manage-user/delete-user-modal/delete-user-modal.component';
import { ViewUserModalComponent } from './admin/manage-user/view-user-modal/view-user-modal.component';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { ManageStockComponent } from './admin/manage-stock/manage-stock.component';
import { ViewStockModalComponent } from './admin/manage-stock/view-stock-modal/view-stock-modal.component';
import { AddStockModalComponent } from './admin/manage-stock/add-stock-modal/add-stock-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    WrapperComponent,
    LogoutComponent,
    ManageUserComponent,
    TradeComponent,
    TradeExecuteModalComponent,
    InventoryComponent,
    StockComponent,
    WatchlistComponent,
    WatchlistModalComponent,
    ConfirmModalComponent,
    AddStockToWatchlistModalComponent,
    AddUserModalComponent,
    UpdateUserModalComponent,
    DeleteUserModalComponent,
    ViewUserModalComponent,
    UserdetailComponent,
    ManageStockComponent,
    ViewStockModalComponent,
    AddStockModalComponent
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
    TradeExecuteModalComponent,
    WatchlistModalComponent,
    AddStockToWatchlistModalComponent,
    ViewUserModalComponent,
    AddUserModalComponent,
    UpdateUserModalComponent,
    DeleteUserModalComponent
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
