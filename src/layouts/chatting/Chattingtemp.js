import React, { useState, useRef, useEffect, useContext } from 'react';
import { Avatar, Box, Stack, TextField, InputAdornment, Typography, Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EastIcon from '@mui/icons-material/East';
import { GetWithExpiry } from 'api/LocalStorage';
import './components/chat.css';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { UserContext } from 'api/LocalStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWebSocket } from 'api/webSocketContext';
import { getDmList } from 'api/axiosGet';
import { getChat } from 'api/axiosGet';
import { insertChat } from 'api/axiosPost';
import { useQuery } from '@tanstack/react-query';
import { getUser } from 'api/axiosGet';
import { wrong } from 'api/alert';

export default function ChatTemp() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const inputFieldHeight = 65; // 입력 필드의 높이를 고정값
    const { activeUser } = useContext(UserContext);
    const { state } = useLocation() || {};
    const { uid1, uid2 } = state;
    const { stompClient } = useWebSocket();
    const [count, setCount] = useState(20);
    const [list, setList] = useState([]);
    const [chatroom, setChatroom] = useState(null);
    const profile = GetWithExpiry("profile");

    const [name, setName] = useState("");
    const otheruser = useQuery({
        queryKey: ['otheruser', uid2],
        queryFn: () => getUser(uid2),
    });

    const handleMessageSend = async () => {
        if (!name) {
            wrong('채팅방 이름을 지정하세요.')
            return;
        }
        if (inputMessage.trim() !== '' && stompClient && stompClient.connected) {
            const cid = await insertChat(name, uid1, uid2, inputMessage);
            setInputMessage('');
            navigate(`/chatlist`, { state: {cid: cid}});
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
    };

    const handleNicknameChange = (event) => {
        setName(event.target.value);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box
                sx={{
                    top: '10%',
                    margin: '20px',
                    padding: '20px',
                    minHeight: '400px',
                    height: 'calc(100vh - 200px)',
                    width: '80%',
                    mx: 'auto',
                    overflowY: 'auto',
                }}
            >
                {otheruser && otheruser.data &&
                    <>
                        <Stack sx={{ fontSize: 'xx-large', fontWeight: 'bold', mx: 'auto' }}>
                            <div style={{ color: 'rgb(88, 67, 135)' }}>
                                <Grid container sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Avatar sx={{ width: '4rem', height: '4rem', mr: 5 }} alt="User" src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${otheruser.data.profile}`} />
                                    <Typography sx={{ color: 'lightcoral' }}>{otheruser.data.nickname}</Typography>
                                </Grid>
                                <TextField
                                    value={name}
                                    onChange={handleNicknameChange}
                                    placeholder='채팅방 이름 입력.'
                                    fullWidth
                                    variant='standard'
                                    sx={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        mt: 5,
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: 'lightcoral',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'lightcoral',
                                            },
                                        },
                                    }}
                                />
                                <hr style={{ opacity: '0.4', marginTop: 20 }} />
                            </div>
                        </Stack>
                        {/* maxHeight를 사용 스크롤 활성 */}
                        <Stack sx={{ maxHeight: `calc(100vh - ${inputFieldHeight + 385}px)`, overflowY: 'auto', flexDirection: 'column-reverse' }}> {/* 메시지 영역의 최대 높이를 조정 */}
                            <br />
                        </Stack>
                        <Stack
                            sx={{
                                width: '100%',
                            }}
                        >
                            <TextField
                                sx={{
                                    marginBottom: '1.5em',
                                    height: `${inputFieldHeight}px`, // 입력 필드의 높이 설정
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'lightcoral',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'lightcoral',
                                        },
                                    },
                                }}
                                fullWidth
                                placeholder="메시지를 입력하세요..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <IconButton onClick={handleMessageSend}>
                                                <EastIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack></>
                }
            </Box>
        </DashboardLayout>
    );
}