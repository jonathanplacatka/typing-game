import React from 'react';
import PlayerState from '../interfaces/PlayerState';
import { playerColors, placeColors, ordinals } from '@/scripts/const';
import { Progress } from '@mantine/core';

interface ScoreboardProps {
    players: PlayerState
    playerID: string;
    numWords: number;
}

export default function ScoreboardProps({players, playerID, numWords}: ScoreboardProps) {
  return (
    <>
        {Object.entries(players).map(([id, {username, score, WPM, place, connected}], index) => (
            <div key={id}>
                {connected ? <p>{ username }{id === playerID && ' (you)'}</p>
                : <p className='text-[#545353]'>{ username } (disconnected)</p>}
                <div className="flex space-x-2">
                    <Progress color={connected ? (playerColors[index]) : ("#6e6e6d")} radius="xs" size="xl" value={(score/numWords)*100}  transitionDuration={650} style={{flex: "1"}}/>       
                    <p className="-mt-1 w-20">{WPM} wpm</p>
                    <p className="-mt-1 w-4" style={{color: placeColors[place]}}>{place > -1 && ordinals[place]}</p>
                </div>
            </div>
        ))} 
    </>
  )
}
