import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiSend,
    FiMessageCircle,
} from "react-icons/fi";

import "./ChatBox.css";

import {
    getConversation,
    sendMessage as sendMessageApi,
} from "../../Services/messageService";


const ChatBox = () => {

    const { receiverId } = useParams();

    const navigate = useNavigate();

    const messagesEndRef = useRef(null);


    // =====================================================
    // STATE
    // =====================================================

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    const getCurrentUserId = () => {

        const userId =
            localStorage.getItem("userId") ||
            localStorage.getItem("user_id");

        if (userId) {
            return String(userId);
        }


        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return "";
            }


            const user =
                JSON.parse(storedUser);


            return String(
                user?._id ||
                user?.id ||
                user?.userId ||
                ""
            );

        } catch (err) {

            console.error(
                "Unable to read current user:",
                err
            );

            return "";

        }

    };


    // =====================================================
    // GET ID FROM MESSAGE
    // =====================================================

    const getUserId = (user) => {

        if (!user) {
            return "";
        }


        if (typeof user === "string") {
            return String(user);
        }


        return String(
            user?._id ||
            user?.id ||
            user?.userId ||
            ""
        );

    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }


        try {

            return new Date(date).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );

        } catch {

            return "";

        }

    };


    // =====================================================
    // NORMALIZE MESSAGE
    // =====================================================

    const normalizeMessage = (msg) => {

        const currentUserId =
            getCurrentUserId();


        const senderId =
            getUserId(msg?.sender);


        return {

            id:
                msg?._id ||
                msg?.id ||
                `${Date.now()}-${Math.random()}`,

            text:
                msg?.message ||
                msg?.text ||
                "",

            sender:
                senderId &&
                currentUserId &&
                senderId === currentUserId
                    ? "sent"
                    : "received",

            time:
                formatTime(
                    msg?.createdAt ||
                    msg?.updatedAt ||
                    msg?.timestamp
                ),

            senderId,

            receiverId:
                getUserId(msg?.receiver),

            isRead:
                Boolean(msg?.isRead),

        };

    };


    // =====================================================
    // LOAD CONVERSATION
    // =====================================================

    const loadConversation = async () => {

        if (!receiverId) {

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "LOADING CHAT"
            );

            console.log(
                "Receiver ID:",
                receiverId
            );

            console.log(
                "Current User ID:",
                getCurrentUserId()
            );

            console.log(
                "================================="
            );


            const response =
                await getConversation(receiverId);


            console.log(
                "Conversation response:",
                response
            );


            /*
             * Backend may return:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * OR
             *
             * {
             *   messages: [...]
             * }
             *
             * OR
             *
             * {
             *   data: [...]
             * }
             */

            let conversation = [];


            if (Array.isArray(response)) {

                conversation = response;

            } else if (
                Array.isArray(response?.messages)
            ) {

                conversation =
                    response.messages;

            } else if (
                Array.isArray(response?.data)
            ) {

                conversation =
                    response.data;

            } else if (
                Array.isArray(
                    response?.data?.messages
                )
            ) {

                conversation =
                    response.data.messages;

            }


            const normalizedMessages =
                conversation.map(
                    normalizeMessage
                );


            setMessages(
                normalizedMessages
            );


        } catch (err) {

            console.error(
                "Failed to load conversation:",
                err
            );


            setMessages([]);


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load messages."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD CHAT WHEN RECEIVER CHANGES
    // =====================================================

    useEffect(() => {

        loadConversation();

    }, [receiverId]);


    // =====================================================
    // AUTO SCROLL
    // =====================================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {

        const trimmedMessage =
            message.trim();


        if (
            !trimmedMessage ||
            !receiverId ||
            sending
        ) {
            return;
        }


        try {

            setSending(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "SENDING MESSAGE"
            );

            console.log(
                "Receiver:",
                receiverId
            );

            console.log(
                "Message:",
                trimmedMessage
            );

            console.log(
                "================================="
            );


            const response =
                await sendMessageApi(
                    receiverId,
                    trimmedMessage
                );


            console.log(
                "Send message response:",
                response
            );


            /*
             * Try to find created message
             */

            const createdMessage =
                response?.message ||
                response?.data ||
                response;


            if (
                createdMessage &&
                typeof createdMessage === "object" &&
                (
                    createdMessage?._id ||
                    createdMessage?.id ||
                    createdMessage?.message
                )
            ) {

                const normalized =
                    normalizeMessage(
                        createdMessage
                    );


                /*
                 * Force sender to sent.
                 *
                 * This avoids problems if the backend
                 * does not populate sender.
                 */

                normalized.sender = "sent";


                setMessages((prev) => [
                    ...prev,
                    normalized,
                ]);

            } else {

                /*
                 * Fallback:
                 * If backend only returns success,
                 * add the message to UI manually.
                 */

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        text: trimmedMessage,
                        sender: "sent",
                        time: formatTime(
                            new Date()
                        ),
                    },
                ]);

            }


            setMessage("");


        } catch (err) {

            console.error(
                "Failed to send message:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to send message."
            );

        } finally {

            setSending(false);

        }

    };


    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(-1);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="chat-page">


            {/* =================================================
                HEADER
               ================================================= */}

            <div className="chat-header">


                <button
                    type="button"
                    className="chat-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft size={20} />

                </button>


                <div className="chat-user-avatar">

                    <FiMessageCircle size={22} />

                </div>


                <div className="chat-user-info">

                    <h2>
                        Project Chat
                    </h2>

                    <p>

                        {receiverId
                            ? "Connected"
                            : "No receiver selected"}

                    </p>

                </div>


            </div>


            {/* =================================================
                ERROR
               ================================================= */}

            {error && (

                <div className="chat-error">

                    {error}

                </div>

            )}


            {/* =================================================
                MESSAGES
               ================================================= */}

            <div className="chat-messages">


                {loading ? (

                    <div className="chat-empty">

                        <div className="chat-loading-spinner" />

                        <p>
                            Loading messages...
                        </p>

                    </div>

                ) : messages.length === 0 ? (

                    <div className="chat-empty">

                        <FiMessageCircle size={40} />

                        <h3>
                            No messages yet
                        </h3>

                        <p>
                            Start the conversation
                            by sending a message.
                        </p>

                    </div>

                ) : (

                    messages.map((msg) => (

                        <div
                            key={msg.id}
                            className={`chat-message-row ${
                                msg.sender === "sent"
                                    ? "sent"
                                    : "received"
                            }`}
                        >

                            <div className="chat-message-bubble">

                                <p>
                                    {msg.text}
                                </p>


                                {msg.time && (

                                    <span className="chat-message-meta">

                                        {msg.time}

                                    </span>

                                )}

                            </div>

                        </div>

                    ))

                )}


                {/* Auto scroll target */}

                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* =================================================
                INPUT
               ================================================= */}

            <div className="chat-input-area">


                <input
                    type="text"
                    className="chat-input"
                    placeholder={
                        receiverId
                            ? "Type a message..."
                            : "Select a receiver first"
                    }
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    disabled={
                        !receiverId ||
                        sending
                    }
                />


                <button
                    type="button"
                    className="chat-send-btn"
                    onClick={sendMessage}
                    disabled={
                        !message.trim() ||
                        !receiverId ||
                        sending
                    }
                >

                    <FiSend size={18} />

                    <span>
                        {sending
                            ? "Sending..."
                            : "Send"}
                    </span>

                </button>


            </div>


        </div>

    );

};


export default ChatBox;