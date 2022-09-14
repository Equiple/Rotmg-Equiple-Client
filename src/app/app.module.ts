import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ApiModule } from 'src/lib/api';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ItemComponent } from './item/item.component';

import { ReversePipe } from './pipes/reverse.pipe';
import { GameService } from './services/game-service';
import { BASE_PATH } from 'src/lib/api';
import { environment } from 'src/environments/environment';


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
    FormsModule,
    ApiModule,
    HttpClientModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: BASE_PATH,
      useValue: environment.apiUrl
    },
    GameService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
