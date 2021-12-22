import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { RegisterComponent } from '../components/register/register.component';
import { WrapperComponent } from '../components/wrapper/wrapper.component';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { InventoryComponent } from '../inventory/inventory.component';
import { TradeComponent } from '../trade/trade.component';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', component: WrapperComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/trade', component: TradeComponent, canActivate: [AuthenticationGuard]
      },
      {
        path: 'user/profile', component: UserProfileComponent, canActivate: [AuthenticationGuard]
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
        path: 'admin/management', component: AdminComponent, canActivate: [AuthenticationGuard]
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
