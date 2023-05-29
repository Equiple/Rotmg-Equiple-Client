//Modules
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ApiModule } from 'src/lib/api';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@angular/cdk/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Components
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { GameLogComponent } from './game-log/game-log.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ModalComponent } from './modal/modal.component';
import { GuideComponent } from './guide/guide.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ReportABugComponent } from './report-a-bug/report-a-bug.component';
import { ComplaintsComponent } from './complaints/complaints.component';
//Services
//import { ModalService } from './services/modal-service';
import { GameService } from './services/game.service';
import { ProfileService } from './services/profile.service';
import { AuthService } from './services/auth.service';
import { ComplaintService } from './services/complaint.service';
import { AuthGuardService } from './services/auth-guard.service';
//Pipes
import { ReversePipe } from './pipes/reverse.pipe';
import { SafeStylePipe } from './pipes/savestyle.pipe';
//Misc
import { BASE_PATH } from 'src/lib/api';
import { environment } from 'src/environments/environment';
import { httpInterceptorProviders } from './http-interceptors';
import { FingerprintjsProAngularModule } from '@fingerprintjs/fingerprintjs-pro-angular';
import { default as Keys } from 'keys.json';

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
    LeaderboardComponent,
    ProfileComponent,
    MainComponent,
    AboutComponent,
    MaintenanceComponent,
    ReportABugComponent,
    ComplaintsComponent
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
    MatTooltipModule,
    ReactiveFormsModule,
    FingerprintjsProAngularModule.forRoot({loadOptions: {
      apiKey: Keys.FingerprintJS.Public,
      region: "eu"
    }})
  ],
  providers: [
    {
      provide: BASE_PATH,
      useValue: environment.apiUrl
    },
    httpInterceptorProviders,
    AuthService,
    GameService,
    ProfileService,
    ComplaintService,
    AuthGuardService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
