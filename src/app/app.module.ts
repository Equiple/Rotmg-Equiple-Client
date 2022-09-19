import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ApiModule } from 'src/lib/api';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { GameLogComponent } from './game-log/game-log.component';
import { ItemComponent } from './item/item.component';

import { ReversePipe } from './pipes/reverse.pipe';
import { GameService } from './services/game-service';
import { BASE_PATH } from 'src/lib/api';
import { environment } from 'src/environments/environment';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal-service';
import { SearchResultsComponent } from './search-results/search-results.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    GameLogComponent,
    ReversePipe,
    ItemComponent,
    ModalComponent,
    SearchResultsComponent
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
    GameService,
    ModalService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
