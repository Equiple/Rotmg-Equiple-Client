import { GameStatistic } from "src/lib/api";

export interface StatField{
    key: keyof GameStatistic,
    title: string
};