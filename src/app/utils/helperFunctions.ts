import { GameStatisticDetailed, Gamemode, PlayerProfile } from "src/lib/api";

export function getPlayerStats(playerProfile: PlayerProfile, gamemode: Gamemode): GameStatisticDetailed | null {
    const key: keyof PlayerProfile = gamemode === Gamemode.Daily ? 'dailyStats' : 'normalStats';
    return playerProfile[key] ?? null;
}