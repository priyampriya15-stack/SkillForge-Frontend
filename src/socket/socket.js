import { io } from "socket.io-client";


// =====================================================
// API URL
// =====================================================

const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


// =====================================================
// SOCKET URL
// =====================================================
//
// Example:
//
// VITE_API_URL = http://localhost:5000/api
//
// Socket URL should become:
//
// http://localhost:5000
//
// =====================================================

const socketUrl =
    apiUrl.replace(/\/api\/?$/, "");


// =====================================================
// CREATE SOCKET CONNECTION
// =====================================================

const socket = io(socketUrl, {

    autoConnect: false,

    transports: ["websocket"],

});


// =====================================================
// CONNECT SOCKET
// =====================================================

export const connectSocket = () => {

    if (!socket.connected) {

        socket.connect();

    }

    return socket;

};


// =====================================================
// DISCONNECT SOCKET
// =====================================================

export const disconnectSocket = () => {

    if (socket.connected) {

        socket.disconnect();

    }

};


// =====================================================
// EXPORT SOCKET
// =====================================================

export default socket;