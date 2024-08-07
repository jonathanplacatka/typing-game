import PlayerState from "../interfaces/PlayerState";

interface LobbyPlayerListProps {
    players: PlayerState;
    playerID: string;
}

export default function LobbyPlayerList({players, playerID} : LobbyPlayerListProps) {
    return (
        <div className="inline-block overflow-auto rounded-lg bg-[#EAEAEA] relative px-4 py-2"> 
            <h2 className="text-black">Connected Players ({Object.keys(players).length}/4)</h2>
            <ul>
                {Object.entries(players).map(([id, {username, host}], index) => (
                    <div key={id + username} className={`mt-1 ${host ? 'flex justify-items-center' : '' }`}>
                        
                        {host &&  <svg
                                        viewBox="0 0 576 512"
                                        fill="gray"
                                        height="20px"
                                        width="10px"
                                        className="pt-2 mt-0.5 pb-1 absolute left-0.5">
                                        <path d="M309 106c11.4-7 19-19.7 19-34 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34l-57.3 114.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24 0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40h.7l45.7 251.4c5.5 30.4 32 52.6 63 52.6h277.2c30.9 0 57.4-22.1 63-52.6L535.3 176h.7c22.1 0 40-17.9 40-40s-17.9-40-40-40-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                                    </svg>} 
                        <li className="subtext text-black">{id === playerID ? `${username} (you)` : username }</li>  
                    </div>   
                 ))}
            </ul>     
        </div>
    );
}