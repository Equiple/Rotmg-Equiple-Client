import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    ReversePipe,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
