"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { Button, ScrollArea, Table, TextInput, Title } from '@mantine/core';
import LoginForm from '../components/LoginComponents/UsernameForm';
import socket from '@/scripts/SocketConnection';

interface Room {
    roomID: string;
    players: object;
    maxCapacity: number;
}
  
export default function Multiplayer() {

    const router = useRouter();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState('');
    const [filteredRooms, setFilteredRooms] = useState<Room[]>();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        //TODO: Maybe implement a better search function?? Kinda trash/wonky
        const { value } = event.currentTarget;
        setSearch(value);

        if (search.length != 0) {
            const filtered = rooms.filter((room) =>
                room.roomID.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredRooms(filtered);
        } 
    };

    useEffect(() => {
        setFilteredRooms(rooms)
    }, [rooms])

    const rows = filteredRooms?.map((element) => {
        return (
            <Table.Tr key={element.roomID}>
                <Table.Td className="pl-0 w-12">{element.roomID}</Table.Td>
                <Table.Td className="pl-14" style={{ textAlign: 'left' }}>{Object.keys(element.players).length} / {element.maxCapacity}</Table.Td>
                <Table.Td className="pl-8" > 
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

    return (
        <div className='flex flex-col justify-center items-center my-10'>
            <div className="inline-flex flex-col justify-center items-center rounded-lg bg-gray-accent p-6 mt-8 min-w-96">                    
                <div className="flex items-center justify-between w-full">
                    <Title order={3} className="pl-6">Rooms</Title>
                    <div className="mt-4 pr-6">
                        <TextInput
                        placeholder="Room ID..."
                        mb="md"
                        radius='lg'
                        inputSize="small"
                        className="w-28 ml-4"
                        value={search}
                        onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <ScrollArea h={250}>
                    <Table highlightOnHover className='w-72' >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="pl-0">Code</Table.Th>
                                <Table.Th className="pl-14">Players</Table.Th>
                                <Table.Th className="pl-14 invisible" >Players</Table.Th>  {/* Stupid hack to make the header fixed in position when the filter returns 0 results*/}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody className=''>{rows}</Table.Tbody>
                    </Table>
                </ScrollArea>
                <div className="">
                    <div className='flex flex-col p-3 mx-4'>
                        <button className ='btntext bg-[#2C2C2C] hover:bg-blue-700 text-white py-2 px-3 mx-5 my-4 rounded-lg' onClick={createRoom}>Create Room</button>
                    </div>
                </div>
            </div>

            <LoginForm></LoginForm>
        </div>
    );
}