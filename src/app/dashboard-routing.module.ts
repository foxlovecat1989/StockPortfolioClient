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
import { WatchlistComponent } from './user/watchlist/watchlist.component';
import { ManageClassifyComponent } from './admin/manage-classify/manage-classify.component';
import { ResetPasswordComponent } from './common/login/rest-password/reset-password.component';
import { ChartsComponent } from './user/stock/charts/charts.component';
import { PrefetchWatchlistService } from './service/prefetch-watchlist.service';


const routes: Routes = [
  {
    path: '', component: WrapperComponent,
    children: [
      {
        path: 'login', component: LoginComponent
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
        path: 'user/stock', resolve: {watchlists: PrefetchWatchlistService}, component: StockComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/watchlist', component: WatchlistComponent, resolve: {watchlists: PrefetchWatchlistService}, canActivate: [AuthenticationGuard]
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
    redirectTo: '/user/report',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
