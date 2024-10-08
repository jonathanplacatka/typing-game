"use client"

import { Button, ScrollArea, Table, TextInput } from '@mantine/core';
import ChangeUsernameModal from '../components/ChangeUsernameModal';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import socket from '@/scripts/SocketConnection';
import generateGuestName from '@/scripts/GenerateGuestName';

interface Room {
    roomID: string;
    players: object;
    maxCapacity: number;
    gameStarted: boolean;
}
  
export default function Multiplayer() {

    const router = useRouter();

    const [username, setUsername] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('getRooms')
        });

        socket.on('updateRooms', (roomList: Room[])=> {
            setRooms(roomList)
        })

        socket.connect();

        return (() => {
            socket.removeAllListeners();
            socket.disconnect();
        })

    }, [])

    useEffect(() => {
        setUsername(sessionStorage.getItem("username") ?? generateGuestName());
    }, [])

    const filteredRooms =  rooms.filter((room) => {
        const roomIDMatches = room.roomID.toLowerCase().includes(searchInput.toLowerCase());
        const hostUsernameMatches = Object.values(room.players).some(
            player => player.host && player.username.toLowerCase().includes(searchInput.toLowerCase())
        );
        return roomIDMatches || hostUsernameMatches
    });

    const joinRoom = (room: Room, roomID : string) => {
        if (Object.keys(room.players).length < room.maxCapacity) {
            router.push(roomID)
        }
    }

    const createRoom = () => {
        socket.emit("createRoom", (roomID: string) => {
            router.push(roomID);
        })
    }

    const rows = filteredRooms.map((room) => {
        const hostname = Object.values(room.players).find((player) => player.host === true)?.username
        const full = Object.keys(room.players).length === room.maxCapacity;

        return (
            <Table.Tr key={room.roomID}>
                <Table.Td className="w-[25%]">{room.roomID}</Table.Td>
                <Table.Td className="w-[25%]" style={{ textAlign: 'left' }}>{hostname}</Table.Td>
                <Table.Td className="w-[25%] pl-5" style={{ textAlign: 'left' }}>{Object.keys(room.players).length} / {room.maxCapacity}</Table.Td>
                <Table.Td className="w-[25%]"> 

                {full || room.gameStarted ? (
                    <button disabled className='border rounded-lg py-1.5 font-semibold min-w-20 bg-[#2e2e2e] border-[#696969] text-[#696969]'>{full ? "Full" : "Started"}</button>
                ) : (
                    <button  className='border rounded-lg py-1.5 font-semibold min-w-20' onClick={() => joinRoom(room, room.roomID)}>Join</button>
                )}
                
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <>
            <div className='flex flex-col justify-center items-center my-14'>
                <div className='flex justify-between w-9/12 items-center'>   
                    <span className='text-white font-bold text-3xl'>multiplayer</span>
                    
                    <div className='flex'>
                        <span className='flex text-gray-400 items-center'>nickname: &nbsp; </span>
                        <span className='flex mr-1 text-white font-bold items-center'>{username}</span>
                        <ChangeUsernameModal username={username} updateUsername={setUsername}/>
                    </div>
                </div>

                <div className="inline-flex flex-col justify-center items-center rounded-lg w-9/12">                    
                    <div className="flex items-center justify-end w-full">
                        <div className="mt-4 pr-6">
                            <TextInput
                                placeholder="Search..."
                                mb="md"
                                radius='lg'
                                inputSize="small"
                                className="w-28 ml-4"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <ScrollArea h={250} className='w-full'>
                        <Table highlightOnHover className='w-full' >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th className="w-[25%]">Code</Table.Th>
                                    <Table.Th className="w-[25%]">Host</Table.Th>
                                    <Table.Th className="w-[25%]">Players</Table.Th>
                                    <Table.Th className="w-[25%] invisible">Players</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>

                        {rows.length === 0 && (
                            <div className='flex mt-24 justify-center w-full'>
                                No Rooms Found
                            </div>
                        )} 
                    </ScrollArea>
                    
                    <div className='flex justify-start w-full'>
                        <button className ='bg-[#275E9D] hover:bg-[#1C416B] text-white py-2 px-3 my-10 rounded-lg' onClick={createRoom}>Create Room</button>
                    </div>
                </div>
            </div>
        </>
    );
}