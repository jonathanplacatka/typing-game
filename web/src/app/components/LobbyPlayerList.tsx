import PlayerState from "../interfaces/PlayerState";

interface LobbyPlayerListProps {
    players: PlayerState;
}

export default function LobbyPlayerList({players} : LobbyPlayerListProps) {
    return (
        <div className="inline-block overflow-auto rounded-lg bg-[#EAEAEA] px-4 py-2"> 
            <h2 className="text-black">Connected Players ({Object.keys(players).length}/4)</h2>
            <ul>
                {Object.entries(players).map(([id, {username}], index) => (
                    <div key={id + username} className="mt-1">
                         <li className="subtext text-black">{username}</li>  
                    </div>   
                 ))}
            </ul>     
        </div>
    );
}