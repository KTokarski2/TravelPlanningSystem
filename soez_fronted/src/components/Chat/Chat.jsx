import React, { useEffect, useState } from 'react';
import { Box, List, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Message from './Message';
import MessageForm from './MessageForm';
import { getCurrentUserData } from '../../services/ProfileService';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { getChatHistory } from '../../services/ChatService';

const ChatContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
}));

const ChatBox = styled(Paper)(({ theme }) => ({
    height: '500px',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
}));

const MessageFormContainer = styled(Box)(({ theme }) => ({
    marginTop: '20px',
}));

const Chat = ({chatRoomId}) => {

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [currentUser, setCurrentUser] = useState({
        id: '',
        name: '',
        avatar: null
    });

    const fetchUserData = async () => {
        const data = await getCurrentUserData();
        setCurrentUser({
            id: data.id,
            name: `${data.firstName} ${data.lastName}`,
            avatar: null
        })
    }

    const fetchMessageHistory = async () => {
        const data = await getChatHistory(chatRoomId);
        if (data) {
            setMessages(data);
        }
    }

    useEffect(() => {
        fetchUserData();
        fetchMessageHistory();
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/topic/chatroom/${chatRoomId}`, (msg) => {
                const newMessage = JSON.parse(msg.body);
                console.log(msg);
                console.log(newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });

        setStompClient(client);

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };

    }, [chatRoomId]);

    const handleSendMessage = (text) => {
        if (stompClient && text.trim()) {
            const chatMessage = {
                content: text,
                sender: currentUser.name,
                userId: currentUser.id,
                type: "CHAT"
            };
            stompClient.send(`/app/chat.sendMessage/${chatRoomId}`, {}, JSON.stringify(chatMessage));
        }
    };

    return (
        <ChatContainer>
            <ChatBox>
                <List>
                    {messages.map((msg) => (
                        <Message key={msg.messageId} message={msg} currentUser={currentUser} />
                    ))}
                </List>
            </ChatBox>
            <MessageFormContainer>
                <MessageForm onSendMessage={handleSendMessage} />
            </MessageFormContainer>
        </ChatContainer>
    );
};

export default Chat;