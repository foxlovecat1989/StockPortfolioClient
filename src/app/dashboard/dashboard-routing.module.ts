import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { TradeComponent } from '../components/trade/trade.component';
import { WrapperComponent } from '../components/wrapper/wrapper.component';
import { AuthenticationGuard } from '../guard/authentication.guard';
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
        path: 'login', component: LoginComponent
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
