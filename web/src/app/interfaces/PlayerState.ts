export default interface PlayerState {
    [id: string]: Player
}

export interface Player {
    username: string;
    score: number;
    WPM: number;
    place: number;
    host: boolean;
    connected: boolean;
}