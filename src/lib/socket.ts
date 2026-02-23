import {io , Socket} from "socket.io-client";

let socket : Socket | null = null;

export const getSocket= (clerk_id : string) : Socket=>{
    if(!socket){
        socket = io("http://localhost:4000" , {
            auth : {
                clerk_id: clerk_id
            },
            autoConnect : false
        })
    }

    return socket;
}

export const disconnectSocket = ()=>{
    if(socket){
        socket.disconnect();
        socket = null;
    }
}