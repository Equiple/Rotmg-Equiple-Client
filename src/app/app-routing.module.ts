import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const routes: Routes = [ 
  { path: '', component: MainComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'maintenance', component: MaintenanceComponent},
  { path: 'about', component: AboutComponent},
  { path: '**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
