import React, { useContext, useState } from "react";
import {
  Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, TextField, Card,
  CardContent, CardHeader, IconButton, Dialog, Box, Button,
  Grid,
  Stack,
  Modal,
  AvatarGroup
} from "@mui/material";
import { Search } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CloseIcon from '@mui/icons-material/Close';

import UserList from "./UserList";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "api/LocalStorage";
import { getFamilyList } from "api/axiosGet";
import { insertFamily } from "api/axiosPost";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "api/emptyCheck";
import Iconify from "components/iconify/iconify";
import { getFamilyUserList } from "api/axiosGet";
import Loading from "api/loading";


export default function Family() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [newname, setNewname] = useState('');
  const [open, setOpen] = useState(false);
  const [modalopen, setModalopen] = useState(false);

  const [faid, setFaid] = useState(-1);
  const { activeUser } = useContext(UserContext);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  if (activeUser.uid === -1) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Typography>
          유저 정보 없음
        </Typography>
      </DashboardLayout>
    )
  }

  const { data: familylist, isLoading, isError } = useQuery({
    queryKey: ['familylist', activeUser.uid],
    queryFn: () => getFamilyList(activeUser.uid),
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh',
        }}> <Loading />
        </div>
      </DashboardLayout>
    )
  }

  const filteredFamilyData = !isEmpty(familylist) ? familylist.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleOpen = (faid) => {
    setOpen(true);
    setFaid(faid);
  }

  const handleNew = () => {
    setModalopen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setFaid(-1);
  };

  const handleModalClose = () => {
    setModalopen(false);
  }

  // 클릭 시 마이페이지 이동 이벤트
  const handleMyPage = (uid) => {
    navigate("/mypage", { state: { uid: uid } }); // state를 통해 navigate 위치에 파라메터 제공
  }

  const makeNewFamily = async () => {

    const result = await insertFamily(newname, activeUser.uid, activeUser.nickname);

    if (result == -1)
      alert('이미 패밀리장인 패밀리가 있습니다');
    else {
      alert('패밀리 생성 성공');
      setOpen(true);
      setFaid(result);
    }
  }

  // const profileimages = familylist.profiledata ? familylist.profiledata.split(',') : null;
  // console.log(familylist[0].profiledata);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Typography variant="h4" gutterBottom>
        Family List
      </Typography>
      <Box>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
          sx={{ width: '35%', marginBottom: 3 }}
        />
        <Button sx={{ fontSize: 20, color: 'lightslategray'}} onClick={handleNew}><Iconify icon="ic:round-plus" /> Family방 생성</Button>
      </Box>
      <Divider sx={{ marginBottom: '10px', color: 'black' }} />

      <Box sx={{ padding: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0', borderRadius: 2, boxShadow: 3, mb: 3 }}> {/* 박스 배경 개선 */}
        <Grid container spacing={2}>
          {filteredFamilyData.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={index}> {/* 여기서 xs를 12에서 6으로 변경 */}
              <Card sx={{ marginBottom: '20px', borderRadius: '10px', boxShadow: 3, }}>
                <CardHeader
                  avatar={<Avatar alt={item.leadername} src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${item.leaderprofile}`} sx={{ cursor: 'pointer' }} onClick={() => handleMyPage(item.leaderuid)} />}
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 'bold',color:'lightcoral' }}>
                      {item.name}
                    </Typography>
                  }
                  subheader={new Date(item.regTime).toLocaleDateString('ko-KR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  sx={{ borderBottom: '3px dashed #e0e0e0', paddingBottom: '10px' }}
                  subheaderTypographyProps={{ style: { color: 'blueviolet' } }}
                />
                <CardContent onClick={() => handleOpen(item.faid)} sx={{ cursor: 'pointer', }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify style={{ marginLeft: '47px' }} icon="heroicons-solid:users" />
                    <Typography variant="body2" sx={{ color: 'text.first', marginLeft: 1,fontWeight: '400' }}>
                      유저 수: {item.usercount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    <AvatarGroup max={4} sx={{ marginLeft: 5, '& .MuiAvatar-root': { width: '30px', height: '30px' } }}>
                      {item && item.profiledata && item.profiledata.split(',').map((profile, idx) => (
                        <Avatar key={idx} src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${profile}`} />
                      ))}
                    </AvatarGroup>
                  </Box>
                </CardContent>
              </Card>
              {index < filteredFamilyData.length - 1 && <Divider />}
            </Grid>
          ))}
        </Grid>
      </Box>


      <Modal
        open={modalopen}
        onClose={handleModalClose}
        aria-labelledby="modaltitle"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modaltitle" fontWeight={'bold'} sx={{ color: 'lightslategray' }}>
            새 패밀리 생성
          </Typography>
          <TextField label="패밀리 이름" variant="outlined"
            value={newname}
            onChange={(e) => setNewname(e.target.value)}
            sx={{
              color: 'lightcoral',
              marginTop: '10px',
              '& .MuiInputLabel-outlined': {
                fontSize: '1rem',
                lineHeight: '1.3',
                color: 'lightcoral',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'lightcoral', // 기본 outline 색상 변경
                },
                '&:hover fieldset': {
                  borderColor: 'lightcoral', // 호버 상태에서 outline 색상 변경
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'lightcoral',
                  color: 'lightcoral', // 포커스 상태에서 outline 색상 변경
                },
                padding: '3px 3px', // 입력 필드의 패딩 조정
              }
            }}
          /> <br />
          <Button variant="outlined" onClick={makeNewFamily} sx={{ marginTop: '10px', color: 'lightcoral', borderColor: 'lightcoral', }}>생성</Button>
        </Box>
      </Modal>

      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          style: {
            width: '75vw', // 원하는 너비로 설정
            maxWidth: '75vw', // 최대 너비 고정
            height: '80vh', // 원하는 높이로 설정
            maxHeight: '80vh', // 최대 높이 고정
          },

        }}
      >
        <IconButton aria-label="close" onClick={handleClose}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }}>
          <CloseIcon />
        </IconButton>
        <UserList faid={faid} />
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
