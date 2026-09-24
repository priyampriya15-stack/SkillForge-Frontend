
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket, { connectSocket } from "../socket/socket";

import {
    getConversation,
    sendMessage
} from "../Services/messageService";

const Chat = () => {
    const { receiverId } = useParams();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    // JWT token
    const token = localStorage.getItem("token");

    // Current logged-in user ID
    const userId = localStorage.getItem("userId");

    // =========================================
    // LOAD PREVIOUS MESSAGES
    // =========================================

    useEffect(() => {

        const loadMessages = async () => {

            try {

                if (!receiverId || !token) {
                    return;
                }

                const response = await getConversation(
                    receiverId,
                    token
                );

                setMessages(response.data || []);

            } catch (error) {

                console.error(
                    "Error loading messages:",
                    error
                );

            }
        };

        loadMessages();

    }, [receiverId, token]);


    // =========================================
    // SOCKET CONNECTION
    // =========================================

    useEffect(() => {

        if (!userId || !receiverId) {
            return;
        }

        connectSocket();

        // Create common room ID
        const roomId = [userId, receiverId]
            .sort()
            .join("_");

        console.log("Joining room:", roomId);

        // Join Socket.IO room
        socket.emit("joinRoom", roomId);


        // Receive real-time message
        const receiveMessage = (data) => {

            console.log(
                "Received message:",
                data
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                data
            ]);

        };

        socket.on(
            "receiveMessage",
            receiveMessage
        );


        // Cleanup
        return () => {

            socket.off(
                "receiveMessage",
                receiveMessage
            );

        };

    }, [userId, receiverId]);


    // =========================================
    // SEND MESSAGE
    // =========================================

    const handleSendMessage = async (e) => {

        e.preventDefault();

        // Don't send empty message
        if (!message.trim()) {
            return;
        }

        try {

            // Save message in MongoDB
            const response = await sendMessage(
                receiverId,
                message,
                token
            );

            const savedMessage = response.data;


            // Show message in current chat
            setMessages((previousMessages) => [
                ...previousMessages,
                savedMessage
            ]);


            // Create same room ID
            const roomId = [userId, receiverId]
                .sort()
                .join("_");


            // Send real-time message
            socket.emit("sendMessage", {

                roomId: roomId,

                sender: savedMessage.sender,

                message: savedMessage.message

            });


            // Clear input
            setMessage("");


        } catch (error) {

            console.error(
                "Error sending message:",
                error
            );

        }

    };


    // =========================================
    // CHAT UI
    // =========================================

    return (

        <div
            style={{
                width: "450px",
                height: "600px",
                margin: "40px auto",

                background: "#ffffff",

                borderRadius: "18px",

                boxShadow:
                    "0 10px 35px rgba(0,0,0,0.12)",

                overflow: "hidden",

                display: "flex",
                flexDirection: "column",

                border:
                    "1px solid #e5e7eb"
            }}
        >

            {/* ================================= */}
            {/* CHAT HEADER */}
            {/* ================================= */}

            <div
                style={{
                    padding: "18px 20px",

                    background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",

                    color: "white",

                    display: "flex",
                    alignItems: "center",

                    gap: "12px"
                }}
            >

                <div
                    style={{
                        width: "45px",
                        height: "45px",

                        borderRadius: "50%",

                        background: "rgba(255,255,255,0.2)",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        fontSize: "20px",
                        fontWeight: "bold"
                    }}
                >
                    👤
                </div>


                <div>

                    <h3
                        style={{
                            margin: 0,
                            fontSize: "18px"
                        }}
                    >
                        Chat
                    </h3>

                    <span
                        style={{
                            fontSize: "13px",
                            opacity: 0.85
                        }}
                    >
                        ● Online
                    </span>

                </div>

            </div>


            {/* ================================= */}
            {/* MESSAGE AREA */}
            {/* ================================= */}

            <div
                style={{
                    flex: 1,

                    padding: "20px",

                    overflowY: "auto",

                    background:
                        "#f8fafc"
                }}
            >

                {messages.length === 0 ? (

                    <div
                        style={{
                            height: "100%",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            color: "#94a3b8",

                            textAlign: "center"
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "10px"
                                }}
                            >
                                💬
                            </div>

                            <p
                                style={{
                                    margin: 0
                                }}
                            >
                                No messages yet
                            </p>

                            <small>
                                Start a conversation
                            </small>

                        </div>

                    </div>

                ) : (

                    messages.map((msg, index) => {

                        // Check current user
                        const senderId =
                            msg.sender?._id ||
                            msg.sender;

                        const isMyMessage =
                            String(senderId) ===
                            String(userId);


                        return (

                            <div
                                key={
                                    msg._id ||
                                    msg.createdAt ||
                                    index
                                }

                                style={{
                                    display: "flex",

                                    justifyContent:
                                        isMyMessage
                                            ? "flex-end"
                                            : "flex-start",

                                    marginBottom: "12px"
                                }}
                            >

                                <div
                                    style={{
                                        maxWidth: "75%",

                                        padding:
                                            "10px 14px",

                                        borderRadius:
                                            isMyMessage
                                                ? "16px 16px 4px 16px"
                                                : "16px 16px 16px 4px",

                                        background:
                                            isMyMessage
                                                ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                                                : "#ffffff",

                                        color:
                                            isMyMessage
                                                ? "#ffffff"
                                                : "#1e293b",

                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.08)"
                                    }}
                                >

                                    {/* Sender name */}

                                    {!isMyMessage && (

                                        <div
                                            style={{
                                                fontSize: "12px",

                                                fontWeight: "600",

                                                color: "#6366f1",

                                                marginBottom:
                                                    "4px"
                                            }}
                                        >
                                            {msg.sender?.name ||
                                                "User"}
                                        </div>

                                    )}


                                    {/* Message */}

                                    <div
                                        style={{
                                            fontSize: "14px",

                                            lineHeight: "1.5",

                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {msg.message}
                                    </div>


                                    {/* Time */}

                                    {msg.createdAt && (

                                        <div
                                            style={{
                                                fontSize: "10px",

                                                marginTop:
                                                    "4px",

                                                opacity: 0.65,

                                                textAlign:
                                                    "right"
                                            }}
                                        >
                                            {new Date(
                                                msg.createdAt
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )}
                                        </div>

                                    )}

                                </div>

                            </div>

                        );

                    })

                )}

            </div>


            {/* ================================= */}
            {/* MESSAGE INPUT */}
            {/* ================================= */}

            <form
                onSubmit={handleSendMessage}

                style={{
                    display: "flex",

                    gap: "10px",

                    padding: "15px",

                    background: "#ffffff",

                    borderTop:
                        "1px solid #e5e7eb"
                }}
            >

                <input
                    type="text"

                    value={message}

                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }

                    placeholder="Type a message..."

                    style={{
                        flex: 1,

                        padding:
                            "12px 15px",

                        border:
                            "1px solid #d1d5db",

                        borderRadius: "25px",

                        outline: "none",

                        fontSize: "14px"
                    }}
                />


                <button
                    type="submit"

                    style={{
                        width: "48px",
                        height: "48px",

                        border: "none",

                        borderRadius: "50%",

                        background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",

                        color: "white",

                        cursor: "pointer",

                        fontSize: "18px",

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center"
                    }}
                >
                    ➤
                </button>

            </form>

        </div>

    );
};

export default Chat;

