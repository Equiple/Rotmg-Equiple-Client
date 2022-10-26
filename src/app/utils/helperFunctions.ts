import { DetailedGameStatistic, Gamemode, PlayerProfile } from "src/lib/api";

export function getPlayerStats(playerProfile: PlayerProfile, gamemode: Gamemode): DetailedGameStatistic  {
    const key: keyof PlayerProfile = gamemode === Gamemode.Daily ? 'dailyStats' : 'normalStats';
    return playerProfile[key]!;
}