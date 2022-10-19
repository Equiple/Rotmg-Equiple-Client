export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './game.service';
import { GameService } from './game.service';
export * from './profile.service';
import { ProfileService } from './profile.service';
export const APIS = [AuthenticationService, GameService, ProfileService];
