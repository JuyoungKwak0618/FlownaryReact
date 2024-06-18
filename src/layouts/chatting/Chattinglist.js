import { ListItem, List, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Box, Divider, Paper, Grid, useEventCallback } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from 'api/LocalStorage';
import { getChatList } from 'api/axiosGet';
import { useWebSocket } from 'api/webSocketContext';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChattingIndex from './ChattingIndex';
import TimeAgo from 'timeago-react';
import { isEmpty } from 'api/emptyCheck';
import { deleteNoticeAllChat } from 'api/axiosPost';
import { deleteNoticeSpecific } from 'api/axiosPost';
import { getUserOnPage } from 'api/axiosGet';
import UserAvatar from 'api/userAvatar';
import UserLoginService from 'ut/userLogin-Service';
import { getChatUserList } from 'api/axiosGet';

export default function ChatList() {
    const { activeUser } = useContext(UserContext);
    const [list, setList] = useState([]);
    const { stompClient } = useWebSocket();
    const [usernum, setUsernum] = useState([]);
    const [count, setCount] = useState(20);
    const navigate = useNavigate();
    const [cid, setCid] = useState(-1);
    const [onfirst, setOnfirst] = useState(0);
    const { state } = useLocation() || {};
    const { search } = useLocation() || {};

    useEffect(() => {
        if (state && state.cid) {
            setCid(state.cid);
        }
        else if (search) {
            const searchParams = new URLSearchParams(search);
            setCid(searchParams.get('cid'));
        }
    }, [state]);

    useEffect(() => {
        if (onfirst === 1 && activeUser.uid !== -1 && cid === -1) {
            const checkuserpage = async () => {
                const page = await getUserOnPage(activeUser.uid, "chat");
                if (page === 0 && stompClient && stompClient.connected) {
                    stompClient.publish({
                        destination: '/app/page',
                        body: JSON.stringify({ userId: activeUser.uid, page: 'chat', action: 'enter' }),
                    });
                }
            }

            checkuserpage();
        }
    }, [cid]);

    useEffect(() => {
        if (activeUser.uid !== -1) {
            const fetchChatList = async () => {
                const chatlist = await getChatList(activeUser.uid, count, 0);
                setOnfirst(1);
                if (!isEmpty(chatlist)) {
                    setList(chatlist);
                } else {
                    console.error("Chat list is empty or not available");
                }
                deleteNoticeAllChat(activeUser.uid);
            }

            fetchChatList();
            let chatrefresh;
            let chatrefresh2;
            let chatdelete;

            if (stompClient && stompClient.connected) {
                console.log('chat websocket connected');
                stompClient.publish({
                    destination: '/app/page',
                    body: JSON.stringify({ userId: activeUser.uid, page: 'chat', action: 'enter' }),
                });

                chatrefresh = stompClient.subscribe(`/topic/chatlist`, async (message) => {
                    const data = JSON.parse(message.body);
                    const onPage = await getUserOnPage(activeUser.uid, 'chatroom' + data.cid);

                    if (onPage === 0) {
                        setList(prevList => {
                            const indexcid = prevList.findIndex(item => item.cid === data.cid);
                            if (indexcid !== -1) {
                                const chat = prevList[indexcid];
                                const newlist = [{
                                    cid: data.cid,
                                    status: chat.status,
                                    statusTime: chat.statusTime,
                                    userCount: chat.userCount,
                                    name: chat.name,
                                    lastMessage: data.lastMessage,
                                    newchatcount: chat.newchatcount + 1,
                                    userone: chat.userone,
                                }, ...prevList.slice(0, indexcid), ...prevList.slice(indexcid + 1)];
                                return newlist;
                            }
                            return prevList;
                        });
                    }
                    else {
                        setList(prevList => {
                            const indexcid = prevList.findIndex(item => item.cid === data.cid);
                            if (indexcid !== -1) {
                                const chat = prevList[indexcid];
                                const newlist = [{
                                    cid: data.cid,
                                    status: chat.status,
                                    statusTime: chat.statusTime,
                                    userCount: chat.userCount,
                                    name: chat.name,
                                    lastMessage: data.lastMessage,
                                    newchatcount: 0,
                                    userone: chat.userone,
                                }, ...prevList.slice(0, indexcid), ...prevList.slice(indexcid + 1)];
                                return newlist;
                            }
                            return prevList;
                        });
                    }
                });

                chatrefresh2 = stompClient.subscribe(`/topic/chatlistnew`, (message) => {
                    const data = JSON.parse(message.body);

                    if (data.targetuser === activeUser.uid) {
                        setList(prevList => {
                            const newlist = [
                                {
                                    cid: data.cid,
                                    status: data.status,
                                    statusTime: data.statusTime,
                                    userCount: data.userCount,
                                    name: data.name,
                                    lastMessage: data.lastMessage,
                                    newchatcount: 1,
                                    userone: data.senduser,
                                }
                                , prevList
                            ]

                            return newlist;
                        });
                    }
                });

                chatdelete = stompClient.subscribe(`/topic/chatdelete`, (message) => {
                    const data = JSON.parse(message.body);

                    setList(prevList => {
                        const indexcid = prevList.findIndex(item => item.cid === data.cid);

                        if (indexcid !== -1) {
                            const newlist = [...prevList.slice(0, indexcid), ...prevList.slice(indexcid + 1)];
                            return newlist;
                            setCid(-1);
                        }
                        return prevList;
                    });
                });
            }

            return () => {
                if (stompClient && stompClient.connected) {
                    stompClient.publish({
                        destination: '/app/page',
                        body: JSON.stringify({ userId: activeUser.uid, page: 'chat', action: 'leave' }),
                    });
                    console.log('chat websocket disconnected');
                }

                if (chatrefresh) {
                    chatrefresh.unsubscribe();
                }
                if (chatrefresh2) {
                    chatrefresh2.unsubscribe();
                }
                if (chatdelete) {
                    chatdelete.unsubscribe();
                }
            }
        }
    }, [activeUser.uid, count, stompClient]);

    const handleChatClick = (cid) => {
        setCid(cid);
        setList(prevList => {
            const indexcid = prevList.findIndex(item => item.cid === cid);
            if (indexcid !== -1) {
                const chat = prevList[indexcid];
                const newlist = [...prevList.slice(0, indexcid), {
                    cid: chat.cid,
                    status: chat.status,
                    statusTime: chat.statusTime,
                    userCount: chat.userCount,
                    name: chat.name,
                    lastMessage: chat.lastMessage,
                    newchatcount: 0,
                    userone: chat.userone,
                }, ...prevList.slice(indexcid + 1)];
                return newlist;
            }
            return prevList;
        })
    }

    const goLogin = () => navigate('/authentication/sign-in');
    if (activeUser.uid === undefined || activeUser.uid < 0) {
        return <UserLoginService goLogin={goLogin} />;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container>
                <Grid item xs={12} sm={4} sx={{ padding: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            elevation={3}
                            sx={{
                                maxWidth: 1200,
                                width: '100%',
                                background: '#fff',
                                borderRadius: 4,
                                overflow: 'hidden',
                                px: 3,
                                py: 1,
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'lightcoral' }}>채팅 목록</Typography>
                            <List sx={{ cursor: 'pointer' }}>
                                {list && list.map((data, idx) => (
                                    <React.Fragment key={idx}>
                                        <ListItem
                                            onClick={() => handleChatClick(data.cid)}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                transition: '0.3s',
                                                '&:hover': {
                                                    backgroundColor: '#e1e8ed',
                                                    transform: 'scale(1.02)',
                                                }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                {data.newchatcount > 0 ? (
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                        badgeContent={
                                                            <div
                                                                style={{
                                                                    width: '1rem',
                                                                    height: '1rem',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'lightcoral',
                                                                    border: '2px solid white',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    color:'white'
                                                                }}
                                                            >
                                                                {data.newchatcount}
                                                            </div>
                                                        }
                                                    >
                                                        <Avatar sx={{ width: 50, height: 50, mr: 1 }}>
                                                            <UserAvatar uid={data.userone} />
                                                        </Avatar>

                                                    </Badge>
                                                ) : (
                                                    <Avatar sx={{ width: 50, height: 50, mr: 1 }}>
                                                        <UserAvatar uid={data.userone} />
                                                    </Avatar>
                                                )}
                                            </ListItemAvatar>
                                            <ListItemText
                                                sx={{ ml: 3 }}
                                                primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>{data.name}</Typography>}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {data.lastMessage}

                                                        </Typography>
                                                        <br />
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            <TimeAgo datetime={data.statusTime} locale="ko" />
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        {idx < list.length - 1 && <Divider variant="middle" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} sx={{ padding: 1 }}>
                    {cid && <ChattingIndex cid={cid} setCid={setCid} />}
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
