"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import GameWindow from "./GameWindow";
import GameOverWindow from "./GameOverWindow";
import Lobby from "./Lobby";
import socket from '@/scripts/SocketConnection';
import PlayerState from "../interfaces/PlayerState";
import JoinRoomError from "./JoinRoomError";
import { Loader } from "@mantine/core";
import generateGuestName from "@/scripts/GenerateGuestName";

interface GameProps {
	roomID: string
}

enum GameState {
    Loading,
    Lobby, 
    GameStarted,
    GameOver,
    Error
}

export default function Game({roomID}: GameProps) {

    const currPlayerID = useRef('');

    const [players, setPlayers] = useState<PlayerState>({});
  
    const [gameState, setGameState] = useState(GameState.Loading); 
    const [gameText, setGameText] = useState('');
    const [errorText, setErrorText] = useState('');
    const [isHost, setIsHost] = useState(false);
    
    const router = useRouter()

    useEffect(() => {

        socket.on('connect', () => {
            currPlayerID.current = socket.id as string;
            const username = sessionStorage.getItem('username') ?? generateGuestName();
            socket.emit('joinRoom', roomID, username, (response: string) => onJoinRoom(response));
        });

        socket.on('disconnect', () => {
            playerLeave();
        })

        socket.on('updatePlayers', (players) => {
            setPlayers(players);
            setIsHost(players[currPlayerID.current].host);
        })

        socket.on('startGame', (gameText) => {
            setGameText(gameText);
            setGameState(GameState.GameStarted);
        })

        socket.on('resetGame', () => {
            setGameState(GameState.Lobby);
        })

        socket.on('endGame', () => {
            setGameState(GameState.GameOver);
        })

        socket.on('updatePlayerScore', (id, newScore, newPlace) => {
            setPlayers(prevPlayers => ({
                ...prevPlayers,
                [id]: {
                    ...prevPlayers[id],
                    score: newScore,
                    place: newPlace
                }
            }));
        })

        socket.on('updatePlayerWPM', (id, newWPM) => {
            setPlayers(prevPlayers => ({
                ...prevPlayers,
                [id]: {
                    ...prevPlayers[id],
                    WPM: newWPM,
                }
            }));
        })

        socket.connect();

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, []);


    const playerStart = () => {
        socket.emit('startGame', roomID);
    }

    const playerReset = () => {
        socket.emit('resetGame', roomID)
    }
    
    const playerLeave = () => {
        socket.disconnect();
        router.push("/multiplayer")
    }

    const onJoinRoom = (response: string) => {
        if (response === "notFound") {
            setGameState(GameState.Error);
            setErrorText(`Room ${roomID} does not exist!`);
        } else if (response === "roomFull") {
            setGameState(GameState.Error);
            setErrorText(`Room ${roomID} is currently full!`);
        } else if (response === "gameStarted") {
            setGameState(GameState.Error);
            setErrorText(`Game is currently in progress!`);
        } else {
            setGameState(GameState.Lobby);
        }
    }

    return  (
        <div className='flex flex-col justify-center items-center bg-transparent'>
            {gameState === GameState.Loading &&
                <Loader className="mt-40" color="white" />
            }
            {gameState === GameState.Error && (
                <JoinRoomError message={errorText}></JoinRoomError>
            )} 
            {gameState === GameState.Lobby && (
                <Lobby roomID={roomID} players={players} playerID={currPlayerID.current} onStart={playerStart} onLeave={playerLeave}></Lobby>
            )}
            {(gameState === GameState.GameStarted || gameState === GameState.GameOver) && (
                <GameWindow roomID={roomID} playerID={currPlayerID.current} players={players} gameText={gameText}/>         
            )}
            {gameState === GameState.GameOver && (
                <GameOverWindow isHost={isHost} playerID={currPlayerID.current} players={players} onPlayAgain={playerReset}/>
            )}
        </div>
    );
}

