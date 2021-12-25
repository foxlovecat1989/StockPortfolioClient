import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStockComponent } from '../admin/manage-stock/manage-stock.component';
import { ManageUserComponent } from '../admin/manage-user/manage-user.component';
import { LoginComponent } from '../components/login/login.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { RegisterComponent } from '../components/register/register.component';
import { WrapperComponent } from '../components/wrapper/wrapper.component';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { InventoryComponent } from '../inventory/inventory.component';
import { PrefetchClassifyService } from '../service/prefetch-classify.service';
import { PrefetchWatchlistService } from '../service/prefetch-watchlist.service';
import { StockComponent } from '../stock/stock.component';
import { TradeComponent } from '../trade/trade.component';
import { UserdetailComponent } from '../userdetail/userdetail.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';

const routes: Routes = [
  {
    path: '', component: WrapperComponent,
    children: [
      {
        path: 'user/trade', component: TradeComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/stock', component: StockComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/watchlist', component: WatchlistComponent, resolve: {watchlists: PrefetchWatchlistService}, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/userdetail', component: UserdetailComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/report', component: InventoryComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'logout', component: LogoutComponent
      },
      {
        path: 'register', component: RegisterComponent
      },
      {
        path: 'admin/management/users', component: ManageUserComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'admin/management/stocks', component: ManageStockComponent, resolve: {classifies: PrefetchClassifyService}, canActivate: [AuthenticationGuard]
      },
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
