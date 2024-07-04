import React from 'react';
import socket from '@/scripts/SocketConnection';

export default function ButtonSocketConnection() {
  
    function connect() {
        socket.connect();
        if (socket.connected) {
            console.log("You have connected to the server");
        }
    }

    function disconnect() {
        socket.disconnect();
        if (socket.disconnected) {
            console.log("You have disconnected from the server");
        }
    }

  return (
    <>
      <div className='layout flex justify-center items-center'>
        <button className ='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2' onClick={connect}>Connect</button>
        <button className ='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2' onClick={disconnect}>Disconnect</button>
      </div>
    </>
  );
}