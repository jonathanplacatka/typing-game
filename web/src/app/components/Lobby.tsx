import LobbyPlayerList from './LobbyPlayerList';
import PlayerState from '../interfaces/PlayerState';
import InviteLink from './InviteLink';
import ChangeUsernameModal from './ChangeUsernameModal';
import socket from '@/scripts/SocketConnection';

interface LobbyProps {
    roomID: string;
    players: PlayerState;
    playerID: string;
    onStart: () => void;
    onLeave: () => void;
};

export default function Lobby({roomID, players, playerID, onStart, onLeave}: LobbyProps) {
 
    const updateUsername = (newUsername: string) => {
        socket.emit('updatePlayerName', roomID, playerID, newUsername);
    }

    return (
        <>
            <div className='bg-gray-accent rounded-lg px-12 py-8 mt-14'>
                <div className="flex justify-between mb-3">
                    <h1 className="text-white">Room {roomID}</h1>
                    <div className="flex">
                        <span className='flex text-gray-400 items-center'>nickname: &nbsp; </span>
                        <span className='flex mr-1 text-white font-bold items-center'>{players[playerID]?.username}</span>
                        <ChangeUsernameModal username={players[playerID]?.username} updateUsername={updateUsername} />
                    </div>
                </div>

                <div className="flex">
                    <LobbyPlayerList players={players} playerID={playerID}></LobbyPlayerList>

                    <div className='flex flex-col items-center p-2 mx-20 my-4 mr-44 space-y-5'>
                        <InviteLink/>
                        {players[playerID]?.host ? (
                            <button className ='w-full bg-[#275E9D] hover:bg-[#1C416B] text-white font-bold rounded py-2' onClick={onStart}>Start Game</button>
                        ) : (
                            <p>waiting for host...</p>
                        )}
                    </div>
                </div>
                 
                <div className='flex w-full justify-end'>
                    <button className='bg-[#BA3C3C] hover:bg-[#862A2A] text-white font-bold rounded px-2 py-1.5' onClick={onLeave}>Leave</button>
                </div>
            </div>
        </>
    );
}