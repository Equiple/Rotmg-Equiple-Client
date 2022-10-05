export * from './game.service';
import { GameService } from './game.service';
export * from './profile.service';
import { ProfileService } from './profile.service';
export const APIS = [GameService, ProfileService];
