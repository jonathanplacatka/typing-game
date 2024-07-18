import PlayerState from "../interfaces/PlayerState";

interface LobbyPlayerListProps {
    players: PlayerState;
}

export default function LobbyPlayerList({players} : LobbyPlayerListProps) {
    return (
        <div className="inline-block  overflow-auto rounded-lg bg-gray-200 px-4 py-2"> 
            <h2>Connected Players ({Object.keys(players).length}/4)</h2>
            <ul>
                {Object.entries(players).map(([id], index) => (
                    <div className="mt-1">
                         <li className="subtext">{id}</li>  
                    </div>   
                 ))}
            </ul>     
        </div>
    );
}