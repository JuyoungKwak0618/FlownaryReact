/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useContext, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import {
  Avatar, Box, Button, Chip, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Modal, Paper, Stack, TextField, Typography, InputAdornment,
  IconButton, Link,
  CardMedia,
  CardHeader,
  Icon,
  Dialog,
} from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GridViewIcon from '@mui/icons-material/GridView';
import DehazeIcon from '@mui/icons-material/Dehaze';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import "./mypage.css";
import { UserContext, GetWithExpiry } from "api/LocalStorage";

import PostingModal from "../home/Board/PostingModal"
import { useQuery } from "@tanstack/react-query";
import { getMyBoardList } from "api/axiosGet";
import BoardDetail from "layouts/home/Board/BoardDetail";
import { useAddLike } from "api/customHook";
import TimeAgo from "timeago-react";
import koreanStrings from '../home/Board/ko';

function Notifications() {

  const uid = parseInt(GetWithExpiry('uid'));
  const [bid, setBid] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  //게시물 책갈피 토글
  const [showToggle, setShowToggle] = useState(true);
  // 게시물 사진 , 글영역
  const [showPhoto, setShowPhoto] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState({});

  const { activeUser } = useContext(UserContext);

  const board = useQuery({
    queryKey: ['board', uid],
    queryFn: () => getMyBoardList(uid),
  });
  const handleOpen = (e) => {
    setOpen(true);
    setBid(e);
  }
  const handleClose = () => {
    setOpen(false);
    setBid(-1);
  };
  const nickname = GetWithExpiry('nickname');
  const profile = GetWithExpiry('profile');
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
  const addLike = useAddLike();
  const addLikeForm = (sendData) => {
    addLike(sendData);
  }
  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      A simple {name} alert with{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        an example link
      </MDTypography>
      . Give it a click if you like.
    </MDTypography>
  );

  const handleToggleButton = () => {
    setShowToggle(true);
  }

  const hanldlePhotoButton = () => {
    setShowPhoto(false);
  }

  const hanldlePhotoButton2 = () => {
    setShowPhoto(true);
  }

  const handleUpdate = () => {
    navigate("../home/Update")
    sessionStorage.setItem("bid", bid);
  }


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* 상단 정보 넣는 Stack 태그 */}
      <Stack direction={'row'} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}> {/* 방향을 row로 지정하면 가로 방향으로 배치됨 */}

        {/* Avatar 태그 : 유튜브 프사처럼 동그란 이미지 넣을 수 있는 것 */}
        <Avatar
          sx={{
            width: '9rem',
            height: '9rem',
            margin: '10px',
            fontSize: '60px',
            border: '2px solid primary.main', // 외곽선 색과 굵기 지정
          }} >

          <div
            style={{
              width: '9rem',
              height: '9rem',
              borderRadius: '50%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url('https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${profile}')` // 이미지 URL 동적 생성
            }}
          >
          </div>
        </Avatar>

        {/* 프사 옆 정보와 팔로우 버튼 만드는 Stack 공간 */}
        <Stack sx={{ padding: '20px' }} fontWeight={'bold'}>
          <Stack direction={'row'} spacing={2} sx={{ marginTop: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight={'bold'}>
              {nickname}
            </Typography>
            {/* <Button onClick={handleCheckingPwd}><SettingsIcon sx={{ fontSize: '50px', color: 'darkgray' }} /></Button> */}
          </Stack>
          <Stack direction={'row'} spacing={2} sx={{ marginTop: '10px', marginBottom: '15px' }}>
            <Box sx={{ cursor: 'pointer' }} >
              게시물 수
            </Box>
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpen('팔로워', '여기에 팔로워 수에 대한 정보를 표시')}>
              팔로워 수
            </Box>
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpen('팔로잉', '여기에 팔로잉 수에 대한 정보를 표시')}>
              팔로잉 수
            </Box>
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <Button color="primary" className='msg_button' style={{ border: "3px solid #BA99D1" }} sx={{ width: '50%' }}>팔로우</Button>
            <Button color="primary" className='msg_button' style={{ border: "3px solid #BA99D1" }} sx={{ width: '70%' }}>메시지 보내기</Button>

            {/* <Button variant="outlined" color="secondary" className='msg_button' sx={{ width: '130px' }} onClick={handlePwd}>비밀번호 변경</Button> */}
          </Stack>
        </Stack>
        <Stack direction={'column'} spacing={2} sx={{ marginTop: '10px', marginBottom: '15px' }}>
        </Stack>
      </Stack >
      {/* <FollowerModal open={followerModalOpen} handleClose={handleClose} content={modalContent} />
      <SettingModal open={SettingModalOpen} handleClose={handleClose} /> */}

      {/* 소개문 넣는 Stack */}
      <Stack sx={{ paddingLeft: '30px', paddingRight: '30px' }}>
        {/* <Link href={user.snsDomain}>{user.snsDomain}</Link> */}
        {/* {user.statusMessage} */}
      </Stack>
      <Divider sx={{ marginTop: '20px', marginBottom: '10px' }}></Divider>
      {/* 게시물과 태그 넣는 거 생성 */}
      <Stack direction="row" justifyContent="center" alignItems='center' spacing={5} sx={{ mt: 2 }}>
        <Stack direction="row" sx={{ cursor: 'pointer' }}>
          <SubjectIcon sx={{ fontSize: 'large' }} />
          <Typography onClick={handleToggleButton} sx={{ fontSize: 'large' }}>게시물</Typography>
        </Stack>
        <Stack direction="row" sx={{ cursor: 'pointer' }}>
          <BookmarkIcon sx={{ fontSize: 'large' }} />
          <Typography sx={{ fontSize: 'large' }}>책갈피</Typography>
        </Stack>
      </Stack>
      <br />
      {/* 게시물 표시하는 Grid */}
      <Grid container spacing={1} sx={{ position: 'relative' }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mr: 3 }}>
          <GridViewIcon onClick={hanldlePhotoButton} sx={{ cursor: 'pointer', mr: 2 }} />
          <DehazeIcon onClick={hanldlePhotoButton2} sx={{ cursor: 'pointer' }} />
        </Grid>
        {showToggle && showPhoto === false ? (board && board.data && board.data.map((data, idx) => {
          const modTime = data.modTime;
          if (!modTime) return null; // modTime이 없으면 건너뜁니다.

          const yearFromModTime = new Date(modTime).getFullYear(); // modTime에서 연도를 추출합니다.
          if (yearFromModTime !== selectedYear) return null; // 선택한 연도와 다른 경우 건너뜁니다.

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
                  <MDBox padding="1rem">
                    {data.image ?
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
                        <button onClick={handleOpen.bind(null, data.bid)}>
                          <img
                            src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.split(',')[0]}` : ''}
                            alt="Paella dish"
                            style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                          />
                        </button>
                      </MDBox>
                      :
                      <MDBox>
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
                          <button onClick={handleOpen.bind(null, data.bid)}>
                            <img
                              src="images/LightLogo.png"
                              alt="Paella dish"
                              style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                            />
                          </button>
                        </MDBox>
                      </MDBox>
                    }
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>
          );
          // 게시글 영역
        })) : (board && board.data && board.data.map((data, idx) =>
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
                      src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
                    />
                  }
                  action={
                    <div>
                      <IconButton aria-label="settings" onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Popover
                        id={id}
                        open={openPopover}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        PaperProps={{
                          style: {
                            marginLeft: 90, // 이 값을 조정하여 팝오버의 가로 위치를 미세하게 조정
                          },
                        }}
                      >
                        {data.uid === activeUser.uid && (
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                            <Button onClick={handleUpdate}>수정</Button>
                            <Button sx={{ padding: 0 }}>공유 하기</Button>
                            <Button sx={{ padding: 0, color: 'red' }}>신고 하기</Button>
                            <Button sx={{ padding: 0 }}>삭제 하기</Button>

                          </Box>
                        )}
                      </Popover>
                    </div>
                  }
                  title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }}>{data.nickname}</Typography>}
                />

                <MDBox padding="1rem">
                  {data.image ?
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
                      <button onClick={handleOpen.bind(null, data.bid)}>
                        <img
                          src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.split(',')[0]}` : ''}
                          alt="Paella dish"
                          style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                        />
                      </button>
                    </MDBox>
                    :
                    <MDBox>
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
                        <button onClick={handleOpen.bind(null, data.bid)}>
                          <img
                            src="images/LightLogo.png"
                            alt="Paella dish"
                            style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                          />
                        </button>
                      </MDBox>
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
                        <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
                        <TimeAgo datetime={data.modTime} locale={koreanStrings} />
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        ))}
      </Grid>
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
            width: '60%', // 원하는 너비 퍼센트로 설정
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
        <BoardDetail bid={bid} uid={uid} handleClose={handleClose} nickname={nickname} handleButtonLike={handleButtonLike} />
      </Dialog>

    </DashboardLayout >
  );
}

export default Notifications;
