import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
