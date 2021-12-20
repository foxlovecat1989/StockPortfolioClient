import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TradeComponent } from '../components/trade/trade.component';
import { WrapperComponent } from '../components/wrapper/wrapper.component';
import { AuthenticationGuard } from '../guard/authentication.guard';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', component: WrapperComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'user/trade', component: TradeComponent,
      },
      {
        path: 'user/profile', component: UserProfileComponent, canActivate: [AuthenticationGuard]
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
