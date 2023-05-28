import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

if (!process.env.REACT_APP_API_URL) {
    throw new Error("REACT_APP_API_URL is not defined");
}

const url = process.env.REACT_APP_API_URL;
export const useSocket = () => {
    const { current: socket } = useRef(
        io(url, {
            autoConnect: false,
            reconnectionAttempts: 5,
            reconnectionDelay: 5000,
        })
    );
    useEffect(
        () => () => {
            if (socket) {
                socket.close();
            }
        },
        [socket]
    );
    return socket;
};
