import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Card, CardHeader, CardMedia, CardActions, CardContent, Avatar, Typography,
  ListItemAvatar, ListItem, List, Button, Box, Modal, Paper,
  ListItemText,
  Grid,
  IconButton,
  Link,
  Dialog,
  DialogTitle
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import PropTypes from 'prop-types';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';
import { GetWithExpiry, SetWithExpiry } from "api/LocalStorage";
import axios from 'axios';
import ReReply from "./ReReply";
import Carousel from 'react-material-ui-carousel'
import { useLocation, useNavigate } from "react-router-dom";
import { useAddReply, useGetUserNicknameLS, useAddReReply } from 'api/customHook.jsx';
import { useGetBoard, useGetBoardByUrl, useGetBoardList, useGetReplyList } from './BoardJS.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBoard, getBoardList, getBoardUrl, getReplyList } from 'api/axiosGet.js';
import BoardDetail from './BoardDetail.jsx';
import MDBox from 'components/MDBox/index.js';
import './board.css';
import MDTypography from 'components/MDTypography/index.js';
import typography from 'assets/theme/base/typography';
import { UserContext } from 'api/LocalStorage';
import { useAddLike } from 'api/customHook';
import { wrong } from 'api/alert';
import { deleteConfirm } from 'api/alert';
import { deleteReply } from 'api/axiosPost';
import { getUser } from 'api/axiosGet';

// 아이콘
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import boxShadow from 'assets/theme/functions/boxShadow';
import { color } from '@cloudinary/url-gen/qualifiers/background';
import UserAvatar from 'api/userAvatar';
import Loading from 'api/loading';

timeago.register('ko', ko);

export default function Reply(props) {
  const bid = props.bid;
  const nickname = props.nickname;
  const [text, setText] = useState('');
  const uid = props.uid;
  const index = props.index;
  const { activeUser } = useContext(UserContext);
  const handleButtonLike = props.handleButtonLike;
  const handleButtonLikeReply = props.handleButtonLikeReply;
  const handleButtonLikeReReply = props.handleButtonLikeReReply;
  const handleMyPage = props.handleMyPage;
  const queryClient = useQueryClient();

  const [expandedContents, setExpandedContents] = useState({});
  const [formChange, setFormChange] = useState({});
  const [showReReply, setShowReReply] = useState({});
  const [ridtext, setRidtext] = useState('');
  const [replyText, setReplyText] = useState('');
  const [formInputs, setFormInputs] = useState({});

  const user = useQuery({
    queryKey: ['boarduser', activeUser.uid],
    queryFn: () => getUser(activeUser.uid),
  });

  const board = useQuery({
    queryKey: ['board', bid, uid],
    queryFn: () => getBoard(bid, uid),
  });

  const replyList = useQuery({
    queryKey: ['reply', props.bid],
    queryFn: () => getReplyList(props.bid, 0, 20, activeUser.uid),
  });

  const addReply = useAddReply();
  const addReReply = useAddReReply();


  const navigate = useNavigate();

  const handleFormSubmit = (e, text) => {
    e.preventDefault();
    if (text === '') {
      wrong('내용을 입력하세요');
      return;
    }
    const sendData = JSON.stringify({
      bid: props.bid,
      uid: props.uid,
      rContents: text,
      nickname: props.nickname,
    });

    addReply(sendData);

    setText('');
    setFormChange(false);
  };

  const handleFormSubmit2 = (e, text2, rid) => {
    e.preventDefault();
    if (text2 === '') {
      wrong('내용을 입력하세요');
      return;
    }
    const sendData = JSON.stringify({
      rid: ridtext,
      uid: props.uid,
      rrContents: formInputs[ridtext],
      nickname: props.nickname,
    });

    addReReply(sendData);

    setFormInputs((prev) => ({
      ...prev,
      [ridtext]: '',
    }));
    if (!showReReply[rid]) {
      handleMoreReply(rid);
    }
  };

  const toggleExpand = (index) => {
    setExpandedContents((prev) => ({
      ...prev,
      [index]: !
        prev[index],
    }));
  };

  const handleButtonClick = (rid) => {
    if (activeUser.uid < 0) {
      wrong("로그인이 필요한 서비스입니다.");
      return;
    }
    setRidtext(rid);
    setFormChange((prev) => ({
      ...prev,
      [rid]: !prev[rid],
    }));
    setFormInputs((prev) => ({
      ...prev,
      [rid]: '',
    }));
    setShowReReply((prev) => ({
      ...prev,
      [rid]: prev[rid],
    }));
  };

  const handleMoreReply = (rid) => {
    setShowReReply((prev) => ({
      ...prev,
      [rid]: !prev[rid],
    }));
  };

  const handleSearchs = (tag) => {
    sessionStorage.setItem("search", tag);
    sessionStorage.setItem("tag", tag);
    if (location.pathname !== 'search') {
      navigate('/search');
    }
  };

  const handleDelete = async (rid) => {
    const confirm = await deleteConfirm();
    if (confirm === 1) {
      await deleteReply(rid);
      queryClient.invalidateQueries(['reply', uid]);
    }
  };
  function handleKeyPress(e, text) {
    if (e && e.key === 'Enter') {
      e.preventDefault(); // 기본 동작 방지
      handleFormSubmit(e, text);
    }
  }
  function handleKeyPress2(e, text2, rid) {
    if (e && e.key === 'Enter') {
      event.preventDefault(); // 기본 동작 방지
      handleFormSubmit2(e, text2, rid);
    }
  }

  const replyList2 = { isLoading: true };
  const user2 = { isLoading: false };
  const board2 = { isLoading: false };

  if (replyList.isLoading || user.isLoading || board.isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loading />
    </div>;
  }

  return (
    <>
      {/* 댓글 내용 List */}
      <MDBox sx={{ display: { xs: 'none', md: 'flex', lg: 'flex' }, flexDirection: 'column', height: '100%', mt: 3 }}>
        <MDBox>
          <MDBox sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
            <MDBox sx={{ display: 'flex', alignItems: 'end', justifyContent: 'start' }}>
              {board && board.data.hashTag ? (
                board.data.hashTag.includes(",") ? (
                  board.data.hashTag.split(",").map((tag, index) => {
                    const trimmedTag = tag.trim(); // 좌우 공백 제거
                    return (
                      <span key={index}>
                        {index > 0 && null}
                        <Button
                          key={index}
                          variant="outlined"
                          style={{ color: 'lightcoral' }}
                          color='warning'
                          onClick={() => handleSearchs(trimmedTag)}
                        >
                          #{trimmedTag}
                        </Button>
                      </span>
                    );
                  })
                ) : (
                  <Button
                    variant="outlined"
                    style={{ color: 'lightcoral' }}
                    color='warning'
                    onClick={() =>
                      handleSearch(board.data.hashTag)
                    }
                  >
                    #{board.data.hashTag}
                  </Button>
                )
              ) : null}
            </MDBox>
            <MDBox>
              <Typography sx={{ fontSize: 'small', mr: 5, color: 'lightcoral' }}>
                {replyList && replyList.data && replyList.data[index] ? '댓글 수 ' + replyList.data[index].replyCount + '개' : ''}
              </Typography>
            </MDBox>
          </MDBox>
          <MDBox sx={{ p: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {user && user.data && <Avatar
              sx={{ bgcolor: 'red'[500], width: '2rem', height: '2rem' }} aria-label="recipe">
              {user.data.profile ? (
                <UserAvatar profileUrl={user.data.profile} />
              ) : (
                <PersonIcon sx={{ width: '100%', height: '100%' }} />
              )}
            </Avatar>
            }

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={activeUser.uid > -1 ? "댓글을 입력하세요." : "로그인이 필요한 서비스입니다."}
              className="custom-input"
              style={{
                border: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.1)', // 아래쪽에만 연한 선 추가
                pointerEvents: activeUser.uid > -1 ? 'auto' : 'none', // uid가 -1보다 크면 입력 가능, 그렇지 않으면 비활성화
                opacity: activeUser.uid > -1 ? 1 : 0.5 // uid가 -1보다 크면 완전히 투명하지 않게, 그렇지 않으면 완전히 투명하게
              }}
              onKeyUp={(e) => handleKeyPress(e, text)}
            />
            <Button onClick={(e) => handleFormSubmit(e, text)}
              sx={{ padding: 0 }}
              style={{ color: 'coral' }}
              disabled={activeUser.uid < 0} >
              게시</Button>
          </MDBox>
        </MDBox>

        {/* 댓글표시 영역 */}
        <Stack direction="column" sx={{ width: "100%", overflowX: 'hidden', p: 3, border: 'none', boxShadow: 'none' }}>
          {replyList && replyList.data && replyList.data.map((data, index) => (
            <List key={index} sx={{ width: '100%', bgcolor: 'background.paper', paddingRight: 0, fontSize: 'small' }}>
              {/* List랑 paper 영역 비슷함 */}
              <Box sx={{ border: 'none', }}>
                <ListItem alignItems="flex-start" sx={{ marginTop: 0, marginLeft: 0.5 }}>
                  <Avatar onClick={() => handleMyPage(data.uid)} sx={{ cursor: 'pointer', width: '1.5rem', height: '1.5rem' }}>
                    <UserAvatar profileUrl={data.profile} />
                  </Avatar>
                  <ListItemText sx={{ paddingLeft: 1 }}
                    primary={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'black', cursor: 'pointer' }} onClick={() => handleMyPage(data.uid)}>{data.nickname}</Typography>}
                    secondary={
                      <Typography variant="body2" sx={{ overflowWrap: 'break-word', fontSize: 'small' }}>
                        {data.rContents}
                      </Typography>
                    }
                  >
                  </ListItemText>


                </ListItem>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid item xs={12} md={6} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ flex: 1, color: 'gray', fontSize: '14px', paddingLeft: 50, }} >  <TimeAgo datetime={data.modTime} locale='ko' />ㆍ</span>
                    <Button sx={{ color: 'lightcoral', padding: 0 }}
                      onClick={() => handleButtonLikeReply(data.rid, data.uid)}>좋아요 {data.likeCount}개
                      {data.liked ?
                        <FavoriteIcon sx={{ color: 'lightcoral' }} /> :
                        <FavoriteBorderIcon sx={{ color: 'lightcoral' }} />}
                    </Button>

                    {!formChange[data.rid] &&
                      <>
                        <Button onClick={() => handleButtonClick(data.rid)} sx={{ color: 'lightcoral', padding: 0 }}>답글</Button>
                        {data.uid === activeUser.uid && <Button onClick={() => handleDelete(data.rid)} sx={{ color: 'lightcoral', padding: 0 }}>삭제</Button>}
                      </>
                    }
                  </Grid>
                </Grid>
                {formChange[data.rid] &&
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%', border: 'none', ml: 3 }}>
                    <input
                      value={formInputs[data.rid] || ''}
                      onChange={(e) => {
                        setFormInputs((prev) => ({
                          ...prev,
                          [data.rid]: e.target.value,
                        }));
                      }}
                      placeholder="댓글입력.."
                      className="custom-input"
                      onClick={(e) => e.stopPropagation()}
                      onKeyUp={(e) => { handleKeyPress2(e, formInputs[data.rid], data.rid); if (e && e.key === 'Enter') { formChange[data.rid] = false } }}
                    />
                    <Button onClick={(e) => { handleFormSubmit2(e, formInputs[data.rid], data.rid); formChange[data.rid] = false; }}
                      sx={{ color: 'lightcoral', padding: 0 }}>게시</Button>
                    <Button onClick={() => handleButtonClick(data.rid)} sx={{ color: 'lightcoral', padding: 0 }}>취소</Button>
                  </Box>
                }
                <Button onClick={() => handleMoreReply(data.rid)} sx={{ marginLeft: 3, paddingTop: 0 }} style={{ color: 'lightcoral' }}>
                  {data.ReReplyCount > 0 && (
                    <>
                      {!showReReply[data.rid] ?
                        <>
                          <KeyboardArrowDownIcon />
                          {`${data.ReReplyCount}개의 댓글 보기`}
                        </> :
                        <>
                          <KeyboardArrowDownIcon />
                          닫기
                        </>
                      }
                    </>
                  )}
                </Button>
                {showReReply[data.rid] && (
                  <ReReply rid={data.rid} uid={uid} nickname={nickname} handleButtonLikeReReply={handleButtonLikeReReply} handleMyPage={handleMyPage} />
                )}
              </Box>
            </List>
          ))}
        </Stack>
      </MDBox>
    </>
  );
}

Reply.propTypes = {
  bid: PropTypes.number,
  nickname: PropTypes.string,
  uid: PropTypes.number,
  index: PropTypes.number,
  handleButtonLike: PropTypes.func,
  handleButtonLikeReply: PropTypes.func,
  handleButtonLikeReReply: PropTypes.func,
  handleMyPage: PropTypes.func,
};