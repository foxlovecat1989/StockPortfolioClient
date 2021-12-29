import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStockComponent } from './admin/manage-stock/manage-stock.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { InventoryComponent } from './user/inventory/inventory.component';
import { StockComponent } from './user/stock/stock.component';
import { TradeComponent } from './user/trade/trade.component';
import { UserdetailComponent } from './user/userdetail/userdetail.component';
import { WatchlistComponent } from './user/watchlist/watchlist.component';
import { ManageClassifyComponent } from './admin/manage-classify/manage-classify.component';
import { UserLogoutComponent } from './common/user-logout/user-logout.component';
import { ResetPasswordComponent } from './common/login/rest-password/reset-password.component';
import { ChartsComponent } from './charts/charts.component';


const routes: Routes = [
  {
    path: '', component: WrapperComponent,
    children: [
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'logout', component: UserLogoutComponent
      },
      {
        path: 'register', component: RegisterComponent
      },
      {
        path: 'reset', component: ResetPasswordComponent
      },
      {
        path: 'charts', component: ChartsComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/trade', component: TradeComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/stock', component: StockComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/watchlist', component: WatchlistComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/userdetail', component: UserdetailComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/report', component: InventoryComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'admin/management/users', component: ManageUserComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'admin/management/stocks', component: ManageStockComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'admin/management/classifies', component: ManageClassifyComponent, canActivate: [AuthenticationGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
