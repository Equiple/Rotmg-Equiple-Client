import { GameStatisticDetailed, Gamemode, PlayerProfile } from "src/lib/api";

export function getPlayerStats(playerProfile: PlayerProfile, gamemode: Gamemode): GameStatisticDetailed  {
    const key: keyof PlayerProfile = gamemode === Gamemode.Daily ? 'dailyStats' : 'normalStats';
    return playerProfile[key]!;
}