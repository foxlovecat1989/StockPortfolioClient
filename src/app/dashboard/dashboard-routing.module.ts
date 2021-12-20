import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { UserComponent } from '../components/user/user.component';
import { WrapperComponent } from '../components/wrapper/wrapper.component';
import { AuthenticationGuard } from '../guard/authentication.guard';

const routes: Routes = [
  {
    path: '', component: WrapperComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'register', component: RegisterComponent
      },
      {
        path: 'calendar', component: CalendarComponent,
      },
      {
        path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard]
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
