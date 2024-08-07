import Player from './player';

export default class Room {

    roomID: string; 
    #players: Map<string, Player>;
    gameStarted: boolean;
    numWords: number;
    playersFinished: number;
    maxCapacity: number;
    
    constructor(roomID: string) {
        this.roomID = roomID;
        this.#players = new Map()
        this.gameStarted = false;
        this.numWords = 0;
        this.playersFinished = 0;
        this.maxCapacity = 4;
    }

    addPlayer(playerId: string, username: string) {
        let newPlayer = new Player(username)

        if(this.isEmpty()) {
            newPlayer.host = true;
        }

        this.#players.set(playerId, newPlayer);
    }

    removePlayer(playerID: string) {
        let playerToRemove : Player | undefined = this.#players.get(playerID);

        if(playerToRemove) {
            //if game is in progress, player is marked as disconnected but not removed
            if(this.gameStarted) {
                playerToRemove.connected = false;
            } else {
                this.#players.delete(playerID);
            }
        
            //choose a new host
            if(playerToRemove.host && this.#players.size > 0) {
                let newHost: Player | undefined = Array.from(this.#players.values()).find(p => p !== playerToRemove);
                
                if(newHost) {
                    newHost.host = true;
                }  

                playerToRemove.host = false;
            }
        }
    }

    getPlayers() {
        return Object.fromEntries(this.#players);
    }

    updatePlayerScore(playerID: string, score: number) {
        let playerToUpdate : Player | undefined = this.#players.get(playerID);

        if (playerToUpdate) {
            playerToUpdate.score = score;

            if(score === this.numWords && playerToUpdate.place === -1) {
                playerToUpdate.place = this.playersFinished;
                this.playersFinished++;
            }

            return playerToUpdate.place
        }

        return -1;
    }

    updatePlayerWPM(playerID: string, WPM: number) {
        let playerToUpdate : Player | undefined = this.#players.get(playerID);

        if (playerToUpdate) {
            playerToUpdate.WPM = WPM;
        }
    }

    reset() {
        this.numWords = 0;
        this.gameStarted = false;
        this.playersFinished = 0;

        this.#players.forEach((player, id) => {
            player.reset();
            if(!player.connected) {
                this.#players.delete(id)
            } 
        });
    }

    numConnected() {
        return Array.from(this.#players.values()).filter(p => p.connected).length;
    }

    isEmpty() {
        return this.numConnected() === 0;
    }

    isFull() {
        return this.#players.size === this.maxCapacity;
    }

    gameOver() {
        return this.numConnected() <= this.playersFinished;
    }
}