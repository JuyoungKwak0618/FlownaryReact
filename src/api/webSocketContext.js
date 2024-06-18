import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from "prop-types";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { UserContext } from './LocalStorage';

const WebSocketContext = createContext();

export const WebSocketProvider = ({children}) => {

    const { activeUser } = useContext(UserContext); 
    const [stompClient, setStompClient] = useState(null);
    const [isConnect, setIsConnect] = useState(false);
    
    useEffect(() => {
        let client;

        if (activeUser.uid !== -1) {
            const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_URL);
            client = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    console.log('Connected to WebSocket');

                    client.publish({
                        destination: '/app/userset',
                        body: JSON.stringify({userId: activeUser.uid, action: 'enter'}),
                    });
                    setStompClient(client);
                    setIsConnect(true);
                },
                onStompError: (frame) => {
                    console.error('STOMP ERROR: ', frame);
                    setIsConnect(false);
                },
                onWebSocketError: (error) => {
                    console.error('WEBSOCKET ERROR: ', error);
                    setIsConnect(false);
                }
            }) 
            
            client.activate();
            
            window.addEventListener('beforeunload', () => {
                if (client && client.connected)
                {
                    client.publish({
                        destination: '/app/userset',
                        body: JSON.stringify({userId: activeUser.uid, action: 'leave'}),
                    });
                    client.deactivate();
                    setStompClient(null);
                    setIsConnect(false);
                }
            })
        }
        else {
            setStompClient(null);
            setIsConnect(false);
        }
        
        return () => {
            if (client && client.connected) {
                client.publish({
                    destination: '/app/userset',
                    body: JSON.stringify({userId: activeUser.uid, action: 'leave'}),
                });
                client.deactivate();
                setStompClient(null);
                setIsConnect(false);
                console.log('Disconnected from WebSocket');
            }
        }
    }, [activeUser.uid]);

    return (
        <WebSocketContext.Provider value={{ stompClient, isConnect }}>
            {children}
        </WebSocketContext.Provider>
    )
}

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useWebSocket = () => useContext(WebSocketContext);