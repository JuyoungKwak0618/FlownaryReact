// 기본
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Card, CardHeader, CardMedia, CardActions, CardContent, Avatar, Typography,
  ListItemAvatar, ListItem, List, Button, Box, Modal, Paper,
  ListItemText,
  Grid
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import PropTypes from 'prop-types';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

// 이모티콘
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person'

import { GetWithExpiry, SetWithExpiry } from "api/LocalStorage";
import axios from 'axios';



import Carousel from 'react-material-ui-carousel'
import { useLocation, useNavigate } from "react-router-dom";
import { useAddReReply, useGetUserNicknameLS } from 'api/customHook.jsx';
import { useGetBoard, useGetBoardByUrl, useGetBoardList, useGetReplyList } from './BoardJS.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBoard, getBoardList, getBoardUrl, getReplyList } from 'api/axiosGet.js';
import BoardDetail from './BoardDetail.jsx';
import MDBox from 'components/MDBox/index.js';
import './board.css';
import { position } from 'stylis';
import MDTypography from 'components/MDTypography/index.js';
import { getReReplyList } from 'api/axiosGet.js';
import { deleteReReply } from 'api/axiosPost.js';
import { useAddLike } from 'api/customHook.jsx';
import { UserContext } from 'api/LocalStorage.js';
import { deleteConfirm } from 'api/alert.jsx';
import UserAvatar from 'api/userAvatar.js';
import Loading from 'api/loading.js';

export default function ReReply(props) {
  timeago.register('ko', ko);
  const rid = props.rid;
  const nickname = props.nickname;
  const [text, setText] = useState('');
  const uid = props.uid;
  const [expandedContents, setExpandedContents] = useState({});
  const { activeUser } = useContext(UserContext);
  const [formChange, setFormChange] = useState({});
  const handleButtonLikeReReply = props.handleButtonLikeReReply;
  const handleMyPage = props.handleMyPage;
  const queryClient = useQueryClient();

  const ReReplyList = useQuery({
    queryKey: ['re-reply', props.rid, activeUser.uid],
    queryFn: () => getReReplyList(props.rid, activeUser.uid),
  });

  const addReReply = useAddReReply();
  const addReReplyForm = (sendData) => {
    addReReply(sendData);
  }

  const handleFormSubmit3 = (e, text3) => {
    e.preventDefault();
    if (text3 === '') {
      wrong('내용을 입력하세요');
      return;
    }
    var sendData = JSON.stringify({
      rid: ridtext,
      uid: props.uid,
      rrContents: formInputs[ridtext],
      nickname: props.nickname,
    })

    addReReply(sendData);

    setFormInputs((prev) => ({
      ...prev,
      [ridtext]: '',
    }));
  };



  const handleDeleteButton = (rrid) => {
    deleteReReply(rrid);
  }

  const toggleExpand = (index) => {
    setExpandedContents((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = async (rrid) => {
    const confirm = await deleteConfirm();
    if (confirm) {
      await deleteReReply(rrid);
      queryClient.invalidateQueries(['ReReplyList', uid]); // 쿼리 무효화
    }
  }
  
  if (ReReplyList.isLoading) {
    return (
      <div><Loading /></div>
    )
  }
  
  return (
    <>
      {/* 댓글 내용 List */}
      <MDBox sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', height: '100%' }}>
        <Stack direction="column" sx={{ padding: 1, overflowY: 'auto' }}>
          <Stack direction="column" alignItems="center" sx={{ width: "100%", overflowX: 'hidden' }}>
            {ReReplyList.data && ReReplyList.data.map((data, index) => (

              <List key={index}
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  paddingRight: 0,
                }}>

                {/* List랑 paper 영역 비슷함 */}
                <Paper sx={{ border: 'none', }}>
                  <ListItem alignItems="flex-start"
                    sx={{
                      width: '50vw',
                      marginTop: 0.25,
                      marginLeft: 2.5,
                    }}>
                    <Avatar sx={{ cursor: 'pointer', width: '1.5rem', height: '1.5rem' }}
                      onClick={() => handleMyPage(data.uid)} >
                      {data.profile ? (<UserAvatar profileUrl={data.profile} />
                      ) : (<PersonIcon sx={{ width: '100%', height: '100%' }} />
                      )}
                    </Avatar>

                    <ListItemText sx={{ paddingLeft: 1 }}
                      primary={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'black', cursor: 'pointer' }} onClick={() => handleMyPage(data.uid)}>{data.nickname}</Typography>}
                      secondary={
                        // 댓글 내용
                        <Typography variant="body1" color="text.primary" sx={{ overflowWrap: 'break-word', fontSize: 'small' }}>
                          <Typography variant="body2" sx={{ overflowWrap: 'break-word', fontSize: 'small' }}>
                            {data.rrContents}
                          </Typography>
                        </Typography>
                      }
                    >
                    </ListItemText>

                  </ListItem>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'grey', fontSize: '14px', paddingLeft: 50, }} >  <TimeAgo datetime={data.modTime} locale='ko' />ㆍ</span>
                    <Button sx={{ color: 'lightcoral', padding: 0 }} onClick={() => handleButtonLikeReReply(data.rrid, data.uid)} >좋아요 {data.likeCount}개 
                    {data.liked ?
                      <FavoriteIcon sx={{ color: 'lightcoral' }} /> : <FavoriteBorderIcon sx={{ color: 'lightcoral' }} />}</Button>
                    {data.uid === activeUser.uid && <Button onClick={() => handleDelete(data.rrid)} sx={{ color: 'lightcoral', padding: 0 }}>삭제</Button>}
                  </div>

                  {/* 답글 목록 */}
                  {data.replies && data.replies.map((reply, replyIndex) => (
                    <ListItem key={replyIndex} sx={{ paddingLeft: 4, marginLeft: 4, borderLeft: '1px solid #ccc' }} alignItems="flex-start">
                      <Avatar>
                        <UserAvatar profileUrl={reply.profile} />
                      </Avatar>
                      <ListItemText sx={{ paddingLeft: 1 }}
                        primary={reply.nickname}
                        secondary={
                          <Typography variant="body1" color="text.primary" sx={{ overflowWrap: 'break-word', }}>
                            {reply.rrContents}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </Paper>
              </List>
            ))}
          </Stack>
        </Stack>
      </MDBox>
    </>
  );
}

ReReply.propTypes = {
  rid: PropTypes.number,
  nickname: PropTypes.string,
  uid: PropTypes.number,
  handleButtonLikeReReply: PropTypes.func,
  handleMyPage: PropTypes.func,
};