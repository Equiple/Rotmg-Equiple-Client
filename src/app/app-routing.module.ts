import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [ 
  { path: '', component: MainComponent},
  { path:'profile', component: ProfileComponent},
  { path:'**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
