import { Component, OnInit } from '@angular/core';
import { GuideComponent } from './guide/guide.component';
import { Dialog } from '@angular/cdk/dialog';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ReportABugComponent } from './report-a-bug/report-a-bug.component';
import { IdentityProvider, PlayerProfile } from 'src/lib/api';
import { ProfileService } from './services/profile.service';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public playerProfile?: PlayerProfile;

    constructor(
        private dialog: Dialog,
        private profileService: ProfileService,
        private authService: AuthService,
    ) { }

    public get realmeyeLoginUri() {
        return `${environment.realmeyeAuthUri}?redirectUri=${location.href}?realmeye=true`;
    }

    public get realmeyeChangePasswordUri() {
        return `${environment.realmeyeAuthUri}/changePassword?redirectUri=${location.href}`;
    }

    async ngOnInit() {
        const params = new URLSearchParams(location.search);
        const realmeyeAuthCode = params.get('realmeye') === 'true' ? params.get('authCode') : null;
        if (realmeyeAuthCode !== null) {
            await this.authService.authenticate({
                provider: IdentityProvider.Realmeye,
                authCode: realmeyeAuthCode,
            });
            params.delete('realmeye');
            params.delete('authCode');
            location.search = params.toString();
        }
        await this.loadProfile();
    }

    public async logout(): Promise<void> {
        await this.authService.logout();
        await this.loadProfile();
    }

    showGuideModal(): void {
        this.dialog.open(GuideComponent);
    }

    showLeaderboardModal() {
        this.dialog.open(LeaderboardComponent);
    }

    showReportABugModal() {
        this.dialog.open(ReportABugComponent);
    }

    private async loadProfile(): Promise<void> {
        await this.profileService.loadPlayerProfile();
        this.playerProfile = await this.profileService.getPlayerProfile();
    }
}
