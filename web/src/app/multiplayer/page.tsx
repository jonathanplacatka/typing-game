"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { Modal, Button, ScrollArea, Table, TextInput } from '@mantine/core';
import UsernameField from '../components/LoginComponents/UsernameField';
import socket from '@/scripts/SocketConnection';

interface Room {
    roomID: string;
    players: object;
    maxCapacity: number;
}
  
export default function Multiplayer() {

    const router = useRouter();

    const [username, setUsername] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState('');
    const [filteredRooms, setFilteredRooms] = useState<Room[]>();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        //TODO: Maybe implement a better search function?? Kinda trash/wonky
        const { value } = event.currentTarget;
        setSearch(value);

        if (search.length != 0) {
            const filtered = rooms.filter((room) => {

                const roomIDMatches = room.roomID.toLowerCase().includes(value.toLowerCase());
                const hostUsernameMatches = Object.values(room.players).some(
                    player => player.host && player.username.toLowerCase().includes(value.toLowerCase())
                );

                return roomIDMatches || hostUsernameMatches
            });

            setFilteredRooms(filtered);
        } 
    };

    useEffect(() => {
        setFilteredRooms(rooms)
    }, [rooms])

    const rows = filteredRooms?.map((element) => {

        const hostname = Object.values(element.players).find((player) => player.host === true).username

        return (
            <Table.Tr key={element.roomID}>
                <Table.Td className="w-[25%]">{element.roomID}</Table.Td>
                <Table.Td className="w-[25%]" style={{ textAlign: 'left' }}>{hostname}</Table.Td>
                <Table.Td className="w-[25%] pl-5" style={{ textAlign: 'left' }}>{Object.keys(element.players).length} / {element.maxCapacity}</Table.Td>
                <Table.Td className="w-[25%]" > 
                    <Button 
                        className='border-white'
                        variant="outline" 
                        color="gray"
                        radius="md" 
                        disabled={Object.keys(element.players).length === element.maxCapacity} 
                        onClick={() => joinRoom(element, element.roomID)}
                        >
                            { Object.keys(element.players).length === element.maxCapacity ? 'Full' : 'Join'}
                    </Button>
                </Table.Td>
            </Table.Tr>
        );
    });

    const joinRoom = (room: Room, roomID : string) => {
        if (Object.keys(room.players).length < room.maxCapacity) {
            router.push(roomID)
        }
    }

    const createRoom = () => {
        let newRoomID = String(Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        router.push(newRoomID);
    }

    useEffect(() => {

        socket.on('connect', () => {
            socket.emit('getRooms')
        });

        socket.on('getAllRooms', (allRooms: Room[])=> {
            setRooms([...rooms, ...allRooms])
        })

        socket.connect();

        return (() => {
            socket.off();
            socket.off('connect');
            socket.off('getAllRooms');
            socket.disconnect();
        })

    }, [])

    useEffect(() => {
        let username: string | null = sessionStorage.getItem("username");
        if (username) {
            setUsername(username)
        }
    }, [])

    return (
        <>
            <Modal opened={openModal} onClose={() => setOpenModal(false)} size="xs" centered title="Change Nickname">
                <UsernameField username={username} updateUsername={setUsername} closeModal={() => setOpenModal(false)} ></UsernameField>
            </Modal>

            <div className='flex flex-col justify-center items-center my-10'>
                <div className='flex justify-between w-9/12 items-center'>   
                    <span className='text-white font-bold text-3xl'>multiplayer</span>
                    
                    <div className='flex'>
                        <span className='flex text-gray-400 items-center'>you: &nbsp; </span>
                        <span className='flex text-white font-bold items-center'> {username} 
                        
                        <button className='' onClick={() => setOpenModal(true)}>
                            <svg className="pl-1 items-center" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>
                            </svg>
                        </button>
                        </span>
                    </div>
                </div>

                <div className="inline-flex flex-col justify-center items-center rounded-lg p-6 w-9/12">                    
                    <div className="flex items-center justify-end w-full">
                        <div className="mt-4 pr-6">
                            <TextInput
                                placeholder="Search..."
                                mb="md"
                                radius='lg'
                                inputSize="small"
                                className="w-28 ml-4"
                                value={search}
                                onChange={handleSearchChange}
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
                                    <Table.Th className="w-[25%] invisible" >Players</Table.Th>  {/* Stupid hack to make the header fixed in position when the filter returns 0 results*/}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                    
                    <div className='flex justify-start w-full'>
                        <button className ='btntext bg-[#2C2C2C] hover:bg-blue-700 text-white py-2 px-3 mx-5 my-4 rounded-lg' onClick={createRoom}>Create Room</button>
                    </div>
                </div>
            </div>
        </>
    );
}