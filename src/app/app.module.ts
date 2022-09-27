import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ApiModule } from 'src/lib/api';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@angular/cdk/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { GameLogComponent } from './game-log/game-log.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ModalComponent } from './modal/modal.component';
import { GuideComponent } from './guide/guide.component';

import { ModalService } from './services/modal-service';
import { GameService } from './services/game-service';

import { ReversePipe } from './pipes/reverse.pipe';
import { SafeStylePipe } from './pipes/savestyle.pipe';

import { BASE_PATH } from 'src/lib/api';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    GameLogComponent,
    ReversePipe,
    SafeStylePipe,
    ModalComponent,
    SearchResultsComponent,
    GuideComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ApiModule,
    HttpClientModule,
    ScrollingModule,
    CdkAccordionModule,
    DialogModule,
    BrowserAnimationsModule,
    MatTooltipModule
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
