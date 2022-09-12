import { Item } from "src/lib/api";


export interface GuessField{
    key: keyof Item,
    title: string,
    icon: string
};
