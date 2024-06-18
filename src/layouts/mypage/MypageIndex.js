import { useContext, useEffect, useRef, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

// TimeAgo + 한글화
import TimeAgo from "timeago-react";
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

// Components Material 
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Iconify from "components/iconify/iconify";

// Mui Materials
import {
  Avatar, Box, Button, Chip, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Modal, Paper, Stack, TextField, Typography, InputAdornment,
  IconButton, Link, CardMedia, CardHeader, Icon, Dialog, Popper, Grid, Card
} from "@mui/material";

// Mui Icon - Materials
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GridViewIcon from '@mui/icons-material/GridView';
import DehazeIcon from '@mui/icons-material/Dehaze';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

import { UserContext, GetWithExpiry } from "api/LocalStorage";
import { getMyBoardList, getLikedBoardList, getUser } from "api/axiosGet";
import { disableBoard, deleteBoard } from "api/axiosPost";
import { deleteConfirm, Declaration } from "api/alert";
import { useAddLike } from "api/customHook";

import { AntSwitch } from '../home/postingStyle.jsx';
import BoardDetail from "layouts/home/Board/BoardDetail";
import "./mypage.css";
import { insertDeclaration } from "api/axiosPost.js";
import { UpdateDisabledRounded } from "@mui/icons-material";
import { getChatCid } from "api/axiosGet.js";
import FollowMeList from "./FollowmeList.jsx";
import FollowList from "./FollowList.jsx";
import { insertFollow } from "api/axiosPost.js";
import { correct } from "api/alert.jsx";
import { getFollowMeList } from "api/axiosGet.js";
import { getFollowList } from "api/axiosGet.js";
import UserAvatar from "api/userAvatar.js";
import UserLoginService from "ut/userLogin-Service.jsx";
import Loading from "api/loading.js";
import { getFollowCount } from "api/axiosGet.js";
function Mypage() {

  const queryClient = useQueryClient();
  timeago.register('ko', ko);

  // useLocation으로 state 받기
  const { state } = useLocation();
  const { activeUser } = useContext(UserContext);

  // 파라메터에 있는 uid 받기
  const { uid } = state != undefined ? state : activeUser;


  // const uid = parseInt(GetWithExpiry('uid'));
  const [bid, setBid] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  //게시물 책갈피 토글
  const [showBoard, setShowBoard] = useState(true); // 게시글를 보여줄지 여부
  const [showLikes, setShowLikes] = useState(false); // 좋아요를 보여줄지 여부

  const [changepage, setChangepage] = useState(true);
  const [currentBid, setCurrentBid] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  // 게시물 사진 , 글영역
  const [showPhoto, setShowPhoto] = useState(false);
  const [expanded, setExpanded] = useState({});

  const board = useQuery({
    queryKey: ['boardmypage', uid],
    queryFn: () => getMyBoardList(uid),
  });

  const likes = useQuery({
    queryKey: ['boardLikeList', uid],
    queryFn: () => getLikedBoardList(uid),
  });

  const user = useQuery({
    queryKey: ['mypageuser', uid],
    queryFn: () => getUser(uid),
  });

  const followMeListCount = useQuery({
    queryKey: ['followmecount', uid],
    queryFn: () => getFollowCount(uid, 1),
  });

  const followListCount = useQuery({
    queryKey: ['followcount', uid],
    queryFn: () => getFollowCount(uid, 0),
  });

  const boardList = board ? board : [];

  const handleOpen = (e) => {
    setOpen(true);
    setBid(e);
  };

  const handleClose = () => {
    setOpen(false);
    setBid(-1);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  }

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleOpen3 = () => {
    setOpen3(true);
  }

  const handleClose3 = () => {
    setOpen3(false);
  };


  const addLike = useAddLike();
  const addLikeForm = (sendData) => {
    addLike(sendData);
  }

  const handleToggle = (bid) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [bid]: !prevExpanded[bid]
    }));

  };

  function handleButtonLike(bid, uid2) {
    if (uid == -1)
      return;

    const sendData = {
      uid: uid,
      fuid: uid2,
      oid: bid,
      type: 1,
    }

    addLikeForm(sendData);
  }

  // 댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReply(rid, uid2) {
    if (uid == -1)
      return;

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
    if (uid === -1) return;

    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rrid,
      type: 3,
    }
    addLikeForm(sendData);

  }

  const toggleBoard = () => {
    if (!showBoard) {
      setShowBoard(true);
      setShowLikes(false);
    }
  };

  const toggleLikes = () => {
    if (!showLikes) {
      setShowLikes(true);
      setShowBoard(false);
    }
  };

  const hanldlePhotoButton = () => {
    setShowPhoto(false);
  }

  const hanldlePhotoButton2 = () => {
    setShowPhoto(true);
  }

  //popper
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const openPopover = Boolean(anchorEl);
  const openPopover2 = Boolean(anchorEl2);
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
      board.refetch();
    }
  };

  // 수정
  const navigate = useNavigate();
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

  // 활성화/비활성화
  const handlePublicButton = (bid, isDeleted) => {
    const d = isDeleted === -1 ? 0 : -1;
    disableBoard(bid, d).then(() => {
      board.refetch();
    });
  };


  const findChatMake = async (uid) => {
    const cid = await getChatCid(uid, activeUser.uid);

    if (cid == -1) {
      navigate("/chattingtemp", { state: { uid1: activeUser.uid, uid2: uid } });
    }
    else {
      navigate("/chatlist", { state: { cid: cid } });
    }
  }

  /// 팔로우
  const handleFollow = async (uid, fuid) => {
    const define = await insertFollow(uid, fuid);
    if (define === 1) {
      correct('플로우 되었습니다!');
    } else {
      correct('언플로우 되었습니다!');
    }
    queryClient.invalidateQueries('followlist');
    queryClient.invalidateQueries('followmelist');
    queryClient.invalidateQueries('followcount');
    queryClient.invalidateQueries('followmecount');
  }

  if (board.isLoading || user.isLoading) {
    return (
      <div><Loading /></div>
    )
  }
  const goLogin = () => navigate('/authentication/sign-in');
  if (activeUser.uid === undefined || activeUser.uid < 0) {
    return <UserLoginService goLogin={goLogin} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* 상단 정보 넣는 Stack 태그 */}
      <Stack direction={'row'} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}> {/* 방향을 row로 지정하면 가로 방향으로 배치됨 */}
        {/* Avatar 태그 : 유튜브 프사처럼 동그란 이미지 넣을 수 있는 것 */}
        <Stack direction={'column'}>
          <Avatar
            sx={{
              width: '12rem',
              height: '12rem',
              margin: '1rem',
              mr: 10,
              fontSize: '60px',
              border: '2px solid primary.main', // 외곽선 색과 굵기 지정
            }} >
            {user && user.data && user.data.profile ? (
              <UserAvatar profileUrl={user.data.profile} size={"large"} />
            ) : (
              <PersonIcon sx={{ width: '100%', height: '100%' }} />
            )}
          </Avatar>
        </Stack>
        <Stack direction={'column'}>
          <Stack direction={'row'}>
            {/* 프사 옆 정보와 팔로우 버튼 만드는 Stack 공간 */}
            <Grid container sx={{ width: '30vw', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 0 }}>
              <Grid item xs={3.5}>
                <Typography fontWeight={'bold'}>
                  {user.data.nickname}
                </Typography>
              </Grid>
              {activeUser.uid !== uid ? <>
                <Grid item xs={3}>
                  <Box sx={{ cursor: 'pointer', my: 0, py: 0, mx: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(10, 10, 10, 0.3)', color: ' rgba(10, 10, 10, 0.6)', borderRadius: 20, '&:hover': { backgroundColor: 'lightcoral', border: '1px solid rgb(255, 255, 255)', color: 'rgb(255, 255, 255)' } }} onClick={() => handleFollow(activeUser.uid, user.data.id)}>
                    <Typography fontSize={'large'}>
                      플로우
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ cursor: 'pointer', my: 0, py: 0, mx: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(10, 10, 10, 0.3)', color: ' rgba(10, 10, 10, 0.6)', borderRadius: 20, '&:hover': { backgroundColor: 'lightcoral', border: '1px solid rgb(255, 255, 255)', color: 'rgb(255, 255, 255)' } }} onClick={() => findChatMake(user.data.id)}>
                    <Typography fontSize={'large'}>
                      메시지
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2.5}>
                </Grid>
              </> : <>
                <Grid item xs={8.5}>
                </Grid>
              </>}
              <Grid item xs={4}>
                <Button sx={{ cursor: 'default', fontSize: 'large', mx: 0, mt: 3, p: 0 }} style={{ color: 'lightcoral' }}>
                  <Typography fontSize={'large'} sx={{ mr: 1 }}>
                    게시물
                  </Typography>
                  <Typography fontSize={'large'} sx={{ mr: 1, fontWeight: 'bold' }}>
                    {board.data.length}
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button sx={{ fontSize: 'large', cursor: 'pointer', mx: 0, mt: 3, p: 0 }} style={{ color: 'lightcoral' }} onClick={() => handleOpen3('팔로워', '여기에 팔로워 수에 대한 정보를 표시')}>
                  <Typography fontSize={'large'} sx={{ mr: 1 }}>
                    플로워
                  </Typography>
                  <Typography fontSize={'large'} sx={{ mr: 1, fontWeight: 'bold' }}>
                    {followMeListCount.data ? followMeListCount.data : 0}
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button sx={{ fontSize: 'large', cursor: 'pointer', mx: 0, mt: 3, p: 0 }} style={{ color: 'lightcoral' }} onClick={() => handleOpen2('팔로잉', '여기에 팔로잉 수에 대한 정보를 표시')}>
                  <Typography fontSize={'large'} sx={{ mr: 1 }}>
                    플로잉
                  </Typography>
                  <Typography fontSize={'large'} sx={{ mr: 1, fontWeight: 'bold' }}>
                    {followListCount.data ? followListCount.data : 0}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Stack>
          <Stack direction={'row'}>
            <Grid container sx={{ width: '150%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 0 }}>
              <Grid item xs={12}>
                <Typography fontSize={'medium'}>
                  {user.data.uname}
                </Typography>
              </Grid>
              <Grid item xs={12} fontWeight={'none'}>
                <Typography fontSize={'medium'}>
                  {user.data.statusMessage}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
      {/* 소개문 넣는 Stack */}
      <Divider sx={{ marginTop: '20px', marginBottom: '10px' }}></Divider>
      {/* 게시물과 태그 넣는 거 생성 */}
      <Stack direction="row" justifyContent="center" alignItems='center' spacing={5} sx={{ mt: 2 }}>
        <Stack direction="row" sx={{ cursor: 'pointer' }}>
          <SubjectIcon sx={{ fontSize: 'large' }} style={{ color: showBoard ? 'lightcoral' : 'rgb(0,0,0)' }} />
          <Typography onClick={toggleBoard} sx={{ fontSize: 'large' }}>게시물</Typography>
        </Stack>
        {uid === activeUser.uid &&
          <Stack direction="row" sx={{ cursor: 'pointer' }}        >
            <Icon sx={{ fontSize: 'large' }} style={{ color: showLikes ? 'lightcoral' : 'rgb(0,0,0)' }}>favorite</Icon>
            <Typography onClick={toggleLikes} sx={{ fontSize: 'large' }} >좋아요</Typography>
          </Stack>}
      </Stack>
      <br />
      {/* 게시물 표시하는 Grid */}
      {
        showBoard &&
        <Grid container spacing={1} sx={{ position: 'relative' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mr: 3 }}>
            <GridViewIcon onClick={hanldlePhotoButton} sx={{ cursor: 'pointer', mr: 2, color: !showPhoto ? 'lightcoral' : null }} />
            <DehazeIcon onClick={hanldlePhotoButton2} sx={{ cursor: 'pointer', color: showPhoto ? 'lightcoral' : null }} />
          </Grid>
          {!showPhoto ?
            (board && board.data && board.data.map((data, idx) => {
              return (
                <Grid key={idx} item xs={3}>
                  <MDBox mb={3}>
                    <Card sx={{
                      height: "100%",
                      transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                      '&:hover': {
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                      }
                    }}>
                      <MDBox >
                        {data.image &&
                          <MDBox onClick={handleOpen.bind(null, data.bid)}
                            variant="gradient"
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
                              src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.includes(',') ? data.image.split(',')[0] : data.image}` : ''}
                              alt="Paella dish"
                              style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                            />
                          </MDBox>
                        }
                      </MDBox>
                    </Card>
                  </MDBox>
                </Grid>
              );
              // 게시글 영역
            })) :
            (
              board && board.data && board.data.map((data, idx) =>
                <Grid key={idx} item xs={12} md={6} lg={4} >
                  <MDBox mb={3}>
                    <Card sx={{
                      height: "100%",
                      transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                      '&:hover': {
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                      }
                    }}>
                      <CardHeader
                        sx={{ padding: 1 }}
                        avatar={
                          <Avatar
                            aria-label="recipe"
                            src={data.profile && `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
                          />
                        }
                        action={<>
                          {
                            data.uid === activeUser.uid && (<>
                              <IconButton aria-label="settings" onClick={(event) => handleClick(event, data.bid)} ref={popperRef}>
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

                            </>)
                          }</>
                        }
                        title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }}>{data.nickname}</Typography>}
                      />

                      <MDBox padding="1rem">
                        {data.image &&
                          <MDBox onClick={handleOpen.bind(null, data.bid)}
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
                              src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.includes(',') ? data.image.split(',')[0] : data.image}` : ''}
                              alt="Paella dish"
                              style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                            />
                          </MDBox>
                        }
                        <MDBox pt={3} pb={1} px={1}>
                          <button onClick={handleOpen.bind(null, data.bid)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0, margin: 0 }}>
                            <MDTypography variant="h6" textTransform="capitalize">
                              {data.title}
                            </MDTypography>
                            {expanded[data.bid] ? (
                              <MDTypography component="div" variant="button" color="text" fontWeight="light">
                                {data.bContents}
                              </MDTypography>
                            ) : (
                              <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {data.bContents}
                              </MDTypography>
                            )}
                          </button>
                          <Button onClick={() => handleToggle(data.bid)}>{expanded[data.bid] ? '...' : '...'}</Button>
                          <Divider />
                          <MDBox display="flex" alignItems="center">
                            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
                              <Icon>schedule</Icon>
                            </MDTypography>
                            <MDTypography variant="button" color="text" fontWeight="light">
                              <TimeAgo datetime={data.modTime} locale='ko' />
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        {uid === activeUser.uid &&
                          < Button onClick={() => handlePublicButton(data.bid, data.isDeleted)}>
                            <Typography sx={{ marginRight: '1em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>
                              {data.isDeleted == 0 ? '공개' : '비공개'}
                            </Typography>
                            <AntSwitch sx={{ marginTop: '0.25em' }} checked={data.isDeleted == 0} inputProps={{ 'aria-label': 'ant design' }} />
                          </Button>
                        }
                      </MDBox>
                    </Card>
                  </MDBox>
                </Grid>
              ))
          }
        </Grid >
      }

      {
        uid === activeUser.uid && showLikes &&
        <Grid container spacing={1} sx={{ position: 'relative' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mr: 3 }}>
            <GridViewIcon onClick={hanldlePhotoButton} sx={{ cursor: 'pointer', mr: 2, color: !showPhoto ? 'lightcoral' : null }} />
            <DehazeIcon onClick={hanldlePhotoButton2} sx={{ cursor: 'pointer', color: showPhoto ? 'lightcoral' : null }} />
          </Grid>
          {!showPhoto ?
            (likes && likes.data && likes.data.map((data, idx) => {
              return (
                <Grid key={idx} item xs={3}>
                  <MDBox mb={3}>
                    <Card sx={{
                      height: "100%",
                      transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                      '&:hover': {
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                      }
                    }}>
                      <MDBox>
                        {data.image &&
                          <MDBox onClick={handleOpen.bind(null, data.bid)}
                            variant="gradient"
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
                            <button>
                              <img
                                src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.includes(',') ? data.image.split(',')[0] : data.image}` : ''}
                                alt="Paella dish"
                                style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                              />
                            </button>
                          </MDBox>
                        }
                      </MDBox>
                    </Card>
                  </MDBox>
                </Grid>
              );
              // 게시글 영역
            })) :
            (likes && likes.data && likes.data.map((data, idx) =>
              <Grid key={idx} item xs={12} md={6} lg={4} >
                <MDBox mb={3}>
                  <Card sx={{
                    height: "100%",
                    transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                    '&:hover': {
                      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                    }
                  }}>
                    <CardHeader
                      sx={{ padding: 1 }}
                      avatar={
                        <Avatar
                          aria-label="recipe"
                          src={data.profile && `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
                        />
                      }
                      action={<>
                        {
                          data.uid === activeUser.uid ? (<>
                            <IconButton aria-label="settings" onClick={(event) => handleClick(event, data.bid)} ref={popperRef}>
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
                              <Paper style={{
                                padding: '0.3rem',
                                backgroundColor: 'white',
                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                              }}
                                onClick={handleClickInside}>
                                <Button sx={{
                                  py: 0,
                                  pl: 1,
                                  pr: 1,
                                  color: 'blue',
                                  '&:hover': { color: 'blue' },
                                }} onClick={handleUpdate}><Iconify style={{ marginRight: '0.1rem' }} icon="lucide:edit" />수정</Button>
                                <Button sx={{
                                  py: 0,
                                  pl: 1,
                                  pr: 1,
                                  color: 'red',
                                  '&:hover': { color: 'red' },
                                }} onClick={() => handleDelete()}><Iconify style={{ marginRight: '0.1rem' }} icon="solar:trash-bin-trash-bold" />삭제</Button>
                              </Paper>
                            </Popper >
                          </>) : <>
                            <IconButton aria-label="settings" onClick={(event) => handleClick2(event, data.bid)} ref={popperRef} >
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
                              <Paper
                                style={{
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
                      title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }}>{data.nickname}</Typography>}
                    />

                    <MDBox padding="1rem">
                      {data.image &&
                        <MDBox onClick={handleOpen.bind(null, data.bid)}
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
                            src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.includes(',') ? data.image.split(',')[0] : data.image}` : ''}
                            alt="Paella dish"
                            style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                          />
                        </MDBox>}
                      <MDBox pt={3} pb={1} px={1}>
                        <button onClick={handleOpen.bind(null, data.bid)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0, margin: 0 }}>
                          <MDTypography variant="h6" textTransform="capitalize">
                            {data.title}
                          </MDTypography>
                          {expanded[data.bid] ? (
                            <MDTypography component="div" variant="button" color="text" fontWeight="light">
                              {data.bContents}
                            </MDTypography>
                          ) : (
                            <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {data.bContents}
                            </MDTypography>
                          )}
                        </button>
                        <Button onClick={() => handleToggle(data.bid)}>{expanded[data.bid] ? '...' : '...'}</Button>
                        <Divider />
                        <MDBox display="flex" alignItems="center">
                          <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
                            <Icon>schedule</Icon>
                          </MDTypography>
                          <MDTypography variant="button" color="text" fontWeight="light">
                            <TimeAgo datetime={data.modTime} locale='ko' />
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Card>
                </MDBox>
              </Grid>
            ))}
        </Grid>
      }
      <br />
      <Footer />
      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
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

        <BoardDetail bid={bid} uid={activeUser.uid} handleClose={handleClose} nickname={user.data.nickname} handleButtonLikeReply={handleButtonLikeReply} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLike={handleButtonLike} />
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '60%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
          },
        }}
      >
        <IconButton aria-label="close" onClick={handleClose2}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
        <FollowList uid={uid} handleClose2={handleClose2} />
      </Dialog>

      <Dialog
        open={open3}
        onClose={handleClose3}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '60%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
          },
        }}
      >
        <IconButton aria-label="close" onClick={handleClose3}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
        <FollowMeList uid={uid} handleClose3={handleClose3} />
      </Dialog>
    </DashboardLayout >
  );
}

export default Mypage;