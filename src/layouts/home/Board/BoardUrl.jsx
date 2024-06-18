// 기본
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  Card, CardHeader, CardMedia, CardActions, CardContent, Avatar, Typography,
  ListItemAvatar, ListItem, List, Button, Box, Modal, Paper,
  Popover, Grid, Divider, IconButton, Icon, Dialog, Popper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/system';
import PropTypes from 'prop-types';

// 아이콘
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Iconify from "components/iconify/iconify";

import axios from 'axios';

import Carousel from 'react-material-ui-carousel'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QueryClient, useQuery } from '@tanstack/react-query';
import MDBox from 'components/MDBox/index.js';
import MDTypography from 'components/MDTypography/index.js';
import TimeAgo from 'timeago-react';
import { UserContext } from 'api/LocalStorage.js';
import Footer from 'examples/Footer/index.js';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout/index.js';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar/index.js';
import BoardDetail from './BoardDetail.jsx';
import { useAddLike } from 'api/customHook.jsx';
import { getBoardUrl } from 'api/axiosGet.js';
import TodoList from "../todoList/TodoListIndex.js";
import { wrong } from 'api/alert.jsx';
import { deleteConfirm } from 'api/alert.jsx';
import { deleteBoard } from 'api/axiosPost.js';
import { Declaration } from 'api/alert.jsx';
import Loading from 'api/loading.js';

function BoardUrl() {
  const { state } = useLocation();
  const queryClient = new QueryClient();
  const { '*': url } = useParams();
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [bid, setBid] = useState(state != undefined ? state.bid : 0);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  // 파라메터에 있는 uid 받기
  // useLocation으로 state 받기
  const { activeUser } = useContext(UserContext);
  const { uid } = state != undefined ? state : activeUser;

  const [currentBid, setCurrentBid] = useState(null);
  // 창 열고 닫기
  const handleOpen = (e) => {
    setOpen(true);
    setBid(e);
  }
  const handleClose = () => {
    setOpen(false);
  };

  const urlBoard = useQuery({
    queryKey: ['urlboard', activeUser.url],
    queryFn: () => {
      if (!url || url == "") {
        return Promise.reject('유효하지 않은 URL');
      }
      return getBoardUrl(url, activeUser.uid)
    },
  });

  const addLike = useAddLike();
  const addLikeForm = (sendData) => {
    addLike(sendData);
  }

  // 좋아요 버튼 누를 때 넘기기
  function handleButtonLike(bid, uid2) {
    if (activeUser.uid < 0) {
      wrong('로그인이 필요한 서비스입니다.');
      return;
    }
    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: bid,
      type: 1,
    }

    addLikeForm(sendData);
  }
  // 댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReply(rid, uid2) {
    if (activeUser.uid < 0) {
      wrong('로그인이 필요한 서비스입니다.');
      return;
    }
    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rid,
      type: 2,
    }

    addLikeForm(sendData);
  }
  // 대댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReReply(rrid, uid2) {
    if (activeUser.uid < 0) {
      wrong('로그인이 필요한 서비스입니다.');
      return;
    }

    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rrid,
      type: 3,
    }

    addLikeForm(sendData);
  }

  //popper
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const openPopover = Boolean(anchorEl);
  const openPopover2 = Boolean(anchorEl2);
  // const id = openPopover ? 'simple-popper' : 'close';
  // const id2 = openPopover ? 'simple-popper' : 'close';
  const popperRef = useRef(null);
  const [confirm, setConfirm] = useState('');

  const handleClick = (event, bid) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setCurrentBid(bid);
  };

  const handleClick2 = (event, bid) => {
    setAnchorEl2(anchorEl2 ? null : event.currentTarget);
    setCurrentBid(bid);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleClickInside = (event) => {
    event.stopPropagation(); // 팝오버 내부의 이벤트 전파를 중지합니다.
  };

  // 삭제
  const handleDelete = async () => {
    handleClosePopover();
    const check = await deleteConfirm();

    if (check === 1) {
      await deleteBoard(currentBid);
      if (uid !== undefined) {
        queryClient.invalidateQueries(['boardmypage', uid]);
      }
      urlBoard.refetch();
    }
  };

  // 수정
  const handleUpdate = () => {
    handleClosePopover();
    sessionStorage.setItem("bid", bid);
    navigate("../home/Update");
  }

  // 신고
  const handleSiren = async () => {
    handleClosePopover();
    const check = await Declaration(activeUser.uid);
    if (check !== 0) {
      const sendData = {
        bid: currentBid, uid: activeUser.uid, dTitle: check[0], dContents: check[1]
      }
      await insertDeclaration(sendData);
    }
  }


  if (urlBoard.isLoading) {
      return <div><Loading /></div>;
  }

  if (urlBoard.isError) {
    return (
      <div>{urlBoard.error.message}</div>
    );
  }

  if (urlBoard.data == undefined || urlBoard.data == null) {
    return (
      <div>url에 해당하는 글이 없습니다!</div>
    )
  }
  const images = urlBoard.data.image != null ? urlBoard.data.image.split(',') : null;

  // 클릭 시 마이페이지 이동 이벤트
  const handleMyPage = (uid) => {
    navigate("/mypage", { state: { uid: uid } }); // state를 통해 navigate 위치에 파라메터 제공
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={3}>
          <Stack direction="row" spacing={0}>
            <Stack direction="column" sx={{ flex: 1, mr: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDBox mb={3}>
                    {urlBoard.data.shareUrl ?
                      <Card sx={{
                        transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                        '&:hover': {
                          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                        }
                      }}>
                        <CardHeader
                          sx={{ padding: 1 }}
                          avatar={
                            <Avatar
                              aria-label="recipe" onClick={() => handleMyPage(urlBoard.data.uid)}
                              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${urlBoard.data.profile}`}
                            />
                          }
                          action={<>
                            {
                              urlBoard.data.uid === activeUser.uid ? (<>
                                <IconButton aria-label="settings" onClick={handleClick} ref={popperRef} disabled={Boolean(anchorEl)}>
                                  <MoreVertIcon />
                                </IconButton>
                                <Popper
                                  id={openPopover ? 'simple-popper' : 'close'}
                                  onClose={handleClosePopover}
                                  open={openPopover}
                                  anchorEl={anchorEl}
                                  placement="bottom-end"
                                  modifiers={[
                                    {
                                      name: 'offset',
                                      options: {
                                        offset: [0, 10],
                                      },
                                    },
                                  ]}
                                >
                                  <Paper
                                    style={{
                                      padding: '0.3rem',
                                      backgroundColor: 'white',
                                      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                      borderRadius: '8px',
                                    }}
                                    onClick={(e) => e.stopPropagation()} // 팝오버 내부 클릭 시 이벤트 전파 막기
                                  >
                                    <Button
                                      sx={{
                                        py: 0,
                                        pl: 1,
                                        pr: 1,
                                        color: 'blue',
                                        '&:hover': { color: 'blue' },
                                      }}
                                      onClick={handleUpdate}
                                    >
                                      <Iconify style={{ marginRight: '0.1rem' }} icon="lucide:edit" />수정
                                    </Button>
                                    <Button
                                      sx={{
                                        py: 0,
                                        pl: 1,
                                        pr: 1,
                                        color: 'red',
                                        '&:hover': { color: 'red' },
                                      }}
                                      onClick={() => handleDelete()}
                                    >
                                      <Iconify style={{ marginRight: '0.1rem' }} icon="solar:trash-bin-trash-bold" />삭제
                                    </Button>
                                  </Paper>
                                </Popper>

                              </>) : <>
                                <IconButton aria-label="settings" onClick={handleClick2} ref={popperRef} disabled={Boolean(anchorEl2)}>
                                  <MoreVertIcon />
                                </IconButton>
                                <Popper
                                  id={openPopover2 ? 'simple-popper' : 'close'}
                                  onClose={handleClosePopover}
                                  open={openPopover2}
                                  anchorEl={anchorEl2}
                                  placement="bottom-end"
                                  modifiers={[
                                    {
                                      name: 'offset',
                                      options: {
                                        offset: [0, 10],
                                      },
                                    },
                                  ]}
                                >
                                  <Paper style={{
                                    padding: '0.3rem',
                                    backgroundColor: 'white',
                                    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                  }}
                                    onClick={handleClickInside}>
                                    <Button onClick={() => handleSiren()} sx={{ py: 0, pl: 1, pr: 1, color: 'red', '&:hover': { color: 'red' } }}><Iconify style={{ marginRight: '0.1rem' }} icon="ph:siren-bold" />신고 하기</Button>
                                  </Paper>
                                </Popper >
                              </>
                            }</>
                          }
                          title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }} onClick={() => handleMyPage(urlBoard.data.uid)}>{urlBoard.data.nickname}</Typography>}
                        />
                        <MDBox padding="1rem" onClick={handleOpen.bind(null, urlBoard.data.bid)}>
                          <MDBox
                            variant="gradient"
                            borderRadius="lg"
                            py={2}
                            pr={0.5}
                            sx={{
                              position: "relative", // 이미지를 부모 요소에 상대적으로 위치하도록 설정합니다.
                              height: "12.5rem",
                              overflow: "visible", // 이미지가 부모 요소를 넘어가지 않도록 설정합니다.
                              transition: 'box-shadow 0.3s', // 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              '&:hover img': { // 이미지가 호버될 때의 스타일을 지정합니다.
                                transform: 'scale(1.05)', // 이미지를 확대합니다.
                                transition: 'transform 0.35s ease-in-out', // 확대 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              },
                              '&:hover': { // MDBox가 호버될 때의 스타일을 지정합니다.
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 그림자 효과를 추가합니다.
                              }
                            }}
                          >
                            <img
                              src={urlBoard.data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${images[0]}` : ''}
                              alt="유효하지 않은 url입니다."
                              style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                            />
                          </MDBox>
                          <MDBox pt={3} pb={1} px={1}>
                            <MDTypography variant="h6" textTransform="capitalize">
                              {urlBoard.data.title}
                            </MDTypography>
                            <MDTypography component="div" variant="button" color="text" fontWeight="light">
                              {urlBoard.data.bContents}
                            </MDTypography>
                            <Divider />
                            <MDBox display="flex" alignItems="center">
                              <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
                                <Icon>schedule</Icon>
                              </MDTypography>
                              <MDTypography variant="button" color="text" fontWeight="light">
                                <TimeAgo datetime={urlBoard.data.modTime} locale='ko' />
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      </Card>
                      :
                      <> 유효하지 않은 URL 입니다.</>}
                  </MDBox>
                </Grid>
              </Grid>
            </Stack>
            <Stack direction="column" sx={{ flex: 0.5 }}>
              <MDBox mb={3} sx={{ position: 'sticky', top: "5%" }}>
                <TodoList />
              </MDBox>
            </Stack>
          </Stack>
        </MDBox>
      </MDBox>
      {/* 게시글 모달 */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '90%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
          },
        }}
      >
        <IconButton aria-label="close" onClick={handleClose}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
        <BoardDetail bid={bid} uid={activeUser.uid} index={index} handleClose={handleClose} nickname={activeUser.nickname} handleButtonLikeReply={handleButtonLikeReply} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLike={handleButtonLike} />
      </Dialog>

      <Footer />
    </DashboardLayout >
  );
}
export default BoardUrl;